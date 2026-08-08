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

export async function getAllResources(category) {
  const limit = 500;
  let page = 1;
  let all = [];

  while (true) {
    const response = await getResources({ category, limit, page });
    all = all.concat(response.data || []);

    const totalPages = response.pagination?.totalPages || 1;
    if (page >= totalPages) {
      break;
    }
    page += 1;
  }

  return all;
}

export function getSyncStatus() {
  return request("/sync/status");
}

export function getOpportunityById(id) {
  return request(`/opportunities/${id}`);
}

export function getCurrentUser(token) {
  return request("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getSavedOpportunities(token) {
  return request("/users/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function saveOpportunity(token, opportunityId) {
  return request(`/users/saved/${opportunityId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function unsaveOpportunity(token, opportunityId) {
  return request(`/users/saved/${opportunityId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
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

export function cleanResourceText(text) {
  if (!text) {
    return "";
  }

  const stripped = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped || /^null$/i.test(stripped)) {
    return "";
  }

  return stripped;
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

export const BOROUGH_ORDER = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Citywide"];

export function groupByBorough(resources) {
  const groups = new Map();

  resources.forEach((resource) => {
    const borough = resource.borough || "Citywide";
    if (!groups.has(borough)) {
      groups.set(borough, []);
    }
    groups.get(borough).push(resource);
  });

  return [...groups.entries()].sort(([a], [b]) => {
    const indexA = BOROUGH_ORDER.indexOf(a);
    const indexB = BOROUGH_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function parseDescriptionSection(text) {
  const markerPattern = /(?:^|\s)([1-9][0-9]?)\.\s+(?=[A-Z(])/g;
  const matches = [...text.matchAll(markerPattern)];
  const numbers = matches.map((match) => parseInt(match[1], 10));

  const isSequentialList =
    numbers.length >= 3 &&
    numbers[0] === 1 &&
    numbers.every((num, index) => index === 0 || num === numbers[index - 1] + 1);

  if (!isSequentialList) {
    return { type: "paragraph", text };
  }

  const intro = text.slice(0, matches[0].index).trim();
  const items = matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    return text.slice(start, end).trim();
  });

  return { type: "list", intro, items };
}

export function formatDescriptionSections(description) {
  if (!description) {
    return [];
  }

  return description
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseDescriptionSection);
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
