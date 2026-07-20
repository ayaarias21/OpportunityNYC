const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getOpportunities(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return request(`/opportunities${query ? `?${query}` : ""}`);
}

export function getResources(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return request(`/resources${query ? `?${query}` : ""}`);
}

export function getSyncStatus() {
  return request("/sync/status");
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

export function mapOpportunityToCard(opportunity) {
  const category = opportunity.category || "Job";
  const badgeType = category === "Job" ? "fulltime" : category.toLowerCase();
  const orgParts = [opportunity.organization || opportunity.agency, opportunity.borough]
    .filter(Boolean)
    .join(" · ");

  return {
    id: opportunity._id,
    badgeType,
    badgeLabel: category.toUpperCase(),
    title: opportunity.title,
    org: orgParts || "NYC Opportunity",
    posted: formatPostedDate(opportunity.postingDate || opportunity.createdAt),
    link: opportunity.link,
    salarySummary: opportunity.salarySummary,
  };
}
