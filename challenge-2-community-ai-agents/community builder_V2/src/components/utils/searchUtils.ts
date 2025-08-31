// Enhanced search utility for breaking down queries and matching against organization details

export interface SearchableOrganization {
  id: number;
  name: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  website?: string;
  services: string[];
  languages: string[];
  accessibility: boolean;
  verified: boolean;
  rating: number;
  distance: string;
  hours: {
    today: string;
    status: "open" | "closed" | "closing-soon" | "unknown";
  };
  [key: string]: any; // Allow for additional properties
}

export interface SearchResult extends SearchableOrganization {
  relevanceScore: number;
  matchedFields: string[];
  matchedTerms: string[];
}

/**
 * Breaks down a search query into individual words, removing common stop words
 */
export function tokenizeQuery(query: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'i', 'need', 'want', 'looking', 'find',
    'help', 'me', 'my', 'can', 'you', 'please', 'am', 'im', "i'm",
    'where', 'how', 'what', 'when', 'who', 'why'
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word))
    .map(word => word.trim());
}

/**
 * Creates a searchable string from an organization containing all relevant text
 */
export function createSearchableText(org: SearchableOrganization): string {
  const searchableFields = [
    org.name,
    org.type,
    org.description,
    org.address,
    ...org.services,
    ...org.languages.map(lang => `${lang} speaking`),
    org.accessibility ? 'accessible wheelchair access' : '',
    org.verified ? 'verified government approved' : '',
    org.hours.status === 'open' ? '24/7 emergency available' : '',
  ];

  return searchableFields
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Calculates relevance score for an organization based on query terms
 */
export function calculateRelevanceScore(
  org: SearchableOrganization,
  queryTerms: string[],
  searchableText: string
): { score: number; matchedFields: string[]; matchedTerms: string[] } {
  let score = 0;
  const matchedFields: string[] = [];
  const matchedTerms: string[] = [];

  queryTerms.forEach(term => {
    let termScore = 0;
    let fieldMatches: string[] = [];

    // Name matching (highest weight)
    if (org.name.toLowerCase().includes(term)) {
      termScore += 100;
      fieldMatches.push('name');
    }

    // Type matching (high weight)
    if (org.type.toLowerCase().includes(term)) {
      termScore += 80;
      fieldMatches.push('type');
    }

    // Services matching (high weight)
    const serviceMatches = org.services.filter(service => 
      service.toLowerCase().includes(term)
    );
    if (serviceMatches.length > 0) {
      termScore += 70 * serviceMatches.length;
      fieldMatches.push('services');
    }

    // Description matching (medium weight)
    if (org.description.toLowerCase().includes(term)) {
      termScore += 50;
      fieldMatches.push('description');
    }

    // Language matching (medium weight)
    const languageMatches = org.languages.filter(lang => 
      lang.toLowerCase().includes(term) || 
      `${lang.toLowerCase()} speaking`.includes(term)
    );
    if (languageMatches.length > 0) {
      termScore += 40 * languageMatches.length;
      fieldMatches.push('languages');
    }

    // Address/location matching (medium weight)
    if (org.address.toLowerCase().includes(term)) {
      termScore += 30;
      fieldMatches.push('address');
    }

    // Accessibility matching (medium weight)
    if (org.accessibility && (term.includes('access') || term.includes('wheelchair') || term.includes('disability'))) {
      termScore += 40;
      fieldMatches.push('accessibility');
    }

    // 24/7 availability matching
    if (org.hours.today.toLowerCase().includes('24') && (term.includes('emergency') || term.includes('24') || term.includes('urgent'))) {
      termScore += 35;
      fieldMatches.push('availability');
    }

    // Partial word matching in searchable text (lower weight)
    const regex = new RegExp(`\\b${term}`, 'gi');
    const partialMatches = (searchableText.match(regex) || []).length;
    if (partialMatches > 0) {
      termScore += 10 * partialMatches;
      fieldMatches.push('partial');
    }

    // If term found, add to matched terms and fields
    if (termScore > 0) {
      matchedTerms.push(term);
      matchedFields.push(...fieldMatches);
      score += termScore;
    }
  });

  // Bonus scoring factors
  if (org.verified) score += 5;
  if (org.accessibility) score += 5;
  if (org.rating > 4.5) score += 10;
  if (org.hours.status === 'open') score += 8;

  // Distance penalty (closer is better)
  const distanceNum = parseFloat(org.distance);
  if (!isNaN(distanceNum)) {
    if (distanceNum <= 2) score += 15;
    else if (distanceNum <= 5) score += 10;
    else if (distanceNum <= 10) score += 5;
    else if (distanceNum > 50) score -= 10;
  }

  // Normalize score based on number of matched terms
  const normalizedScore = queryTerms.length > 0 ? score / queryTerms.length : 0;

  return {
    score: normalizedScore,
    matchedFields: [...new Set(matchedFields)], // Remove duplicates
    matchedTerms: [...new Set(matchedTerms)] // Remove duplicates
  };
}

/**
 * Enhanced search function that breaks down queries and ranks results by relevance
 */
export function enhancedSearch(
  query: string,
  organizations: SearchableOrganization[],
  maxResults: number = 20,
  filters?: {
    language?: string;
    accessibility?: boolean;
    distance?: string;
  }
): SearchResult[] {
  // Apply language filter first if specified
  let filteredOrganizations = organizations;
  
  if (filters?.language && filters.language !== "any") {
    // Map language codes to full language names
    const languageMap: Record<string, string[]> = {
      'en': ['english'],
      'ar': ['arabic'],
      'zh': ['mandarin', 'chinese'],
      'hi': ['hindi'],
      'es': ['spanish'],
      'vi': ['vietnamese'],
      'it': ['italian'],
      'fa': ['farsi', 'persian'],
      'ca': ['cantonese']
    };

    const searchLanguages = languageMap[filters.language.toLowerCase()] || [filters.language.toLowerCase()];
    
    filteredOrganizations = organizations.filter((org) =>
      org.languages.some((lang) => 
        searchLanguages.some(searchLang => 
          lang.toLowerCase().includes(searchLang) || 
          searchLang.includes(lang.toLowerCase())
        )
      )
    );
  }

  if (filters?.accessibility) {
    filteredOrganizations = filteredOrganizations.filter((org) => org.accessibility);
  }

  if (filters?.distance && filters.distance !== "any") {
    const maxDistance = parseInt(filters.distance.replace("km", ""));
    filteredOrganizations = filteredOrganizations.filter((org) => {
      const orgDistance = parseFloat(org.distance);
      return orgDistance <= maxDistance;
    });
  }

  // Handle empty query
  if (!query.trim()) {
    return filteredOrganizations
      .slice(0, maxResults)
      .map(org => ({
        ...org,
        relevanceScore: 0,
        matchedFields: [],
        matchedTerms: []
      }));
  }

  // Tokenize query into individual terms
  const queryTerms = tokenizeQuery(query);
  
  // If no valid terms after tokenization, return all results
  if (queryTerms.length === 0) {
    return filteredOrganizations
      .slice(0, maxResults)
      .map(org => ({
        ...org,
        relevanceScore: 0,
        matchedFields: [],
        matchedTerms: []
      }));
  }

  // Score and rank each organization
  const scoredResults: SearchResult[] = filteredOrganizations
    .map(org => {
      const searchableText = createSearchableText(org);
      const { score, matchedFields, matchedTerms } = calculateRelevanceScore(
        org,
        queryTerms,
        searchableText
      );

      return {
        ...org,
        relevanceScore: score,
        matchedFields,
        matchedTerms
      };
    })
    .filter(result => result.relevanceScore > 0) // Only include results with matches
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance (highest first)
    .slice(0, maxResults); // Limit results

  return scoredResults;
}

/**
 * Highlights matched terms in text for display purposes
 */
export function highlightMatches(text: string, matchedTerms: string[]): string {
  if (!matchedTerms.length) return text;

  let highlightedText = text;
  
  matchedTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

/**
 * Gets search suggestions based on common service categories
 */
export function getSearchSuggestions(query: string): string[] {
  const suggestions = [
    'food support',
    'emergency food',
    'food bank',
    'housing assistance',
    'emergency accommodation',
    'mental health support',
    'counselling services',
    'disability support',
    'aged care',
    'family services',
    'crisis support',
    'domestic violence help',
    'legal aid',
    'employment help',
    'youth services',
    'community programs',
    'health services',
    'medical help',
    'dental services',
    'translation services',
    'multicultural support',
    'aboriginal services',
    'veterans support',
    'recreation programs',
    'sports clubs',
    'lacrosse',
    'fitness programs',
    'childcare',
    'education programs',
    'training courses'
  ];

  if (!query.trim()) return suggestions.slice(0, 8);

  const queryLower = query.toLowerCase();
  return suggestions
    .filter(suggestion => suggestion.toLowerCase().includes(queryLower))
    .slice(0, 8);
}