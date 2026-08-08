const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

function normalizeListResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      pagination: {
        page: 1,
        limit: payload.length,
        total: payload.length,
        totalPages: 1,
      },
    };
  }

  return {
    data: payload.data || [],
    pagination: payload.pagination || {
      page: 1,
      limit: (payload.data || []).length,
      total: (payload.data || []).length,
      totalPages: 1,
    },
  };
}

export function getOpportunities(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "q") {
        searchParams.set("search", value);
      } else {
        searchParams.set(key, value);
      }
    }
  });

  const query = searchParams.toString();
  return request(`/opportunities${query ? `?${query}` : ""}`).then(normalizeListResponse);
}

export function getResources(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "q") {
        searchParams.set("search", value);
      } else if (key === "type") {
        searchParams.set("category", value === "Food" ? "Food Assistance" : value);
      } else {
        searchParams.set(key, value);
      }
    }
  });

  const query = searchParams.toString();
  return request(`/resources${query ? `?${query}` : ""}`).then(normalizeListResponse);
}

export function getSyncStatus() {
  return request("/sync/status");
}

export function getOpportunityById(id) {
  return request(`/opportunities/${id}`);
}

export function formatPostedDate(dateValue) {
  if (!dateValue) {
    return "Recently posted";
  }

  const postedDate = new Date(dateValue);
  if (Number.isNaN(postedDate.getTime())) {
    return "Recently posted";
  }

  const diffMs = Date.now() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Posted today";
  }
  if (diffDays === 1) {
    return "Posted 1 day ago";
  }
  if (diffDays < 7) {
    return `Posted ${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return "Posted 1 week ago";
  }

  return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
}

export function summarizeText(text, sentenceCount = 3, maxLength = 260) {
  if (!text) {
    return "";
  }

  const sentences = text.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text.trim()];
  const summary = sentences.slice(0, sentenceCount).join(" ").replace(/\s+/g, " ").trim();

  if (summary.length <= maxLength) {
    return summary;
  }

  const truncated = summary.slice(0, maxLength);
  return `${truncated.slice(0, truncated.lastIndexOf(" "))}…`;
}

export function mapOpportunityToCard(opportunity) {
  const category = opportunity.category || "Job";
  const badgeType = category === "Job" ? "fulltime" : category.toLowerCase().replace(/\s+/g, "");

  return {
    id: opportunity._id,
    badgeType,
    badgeLabel: category.toUpperCase(),
    title: opportunity.title,
    org: opportunity.organization || opportunity.agency || "NYC Opportunity",
    borough: opportunity.borough,
    careerLevel: opportunity.careerLevel,
    requiresCivilServiceExam: Boolean(opportunity.requiresCivilServiceExam),
    posted: formatPostedDate(opportunity.postingDate || opportunity.createdAt),
    link: opportunity.link,
    salarySummary: opportunity.salarySummary,
  };
}
