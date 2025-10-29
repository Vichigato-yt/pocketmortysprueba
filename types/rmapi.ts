// types/rmapi.ts
export interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  }
  
  export interface LocationRef {
    name: string;
    url: string;
  }
  
  export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown' | string;
    species: string;
    type: string;
    gender: string;
    origin: LocationRef;
    location: LocationRef;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
  export interface CharactersResponse {
    info: Info;
    results: Character[];
  }
  