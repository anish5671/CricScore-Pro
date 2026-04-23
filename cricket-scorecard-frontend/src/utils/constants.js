export const API_BASE_URL=import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const WS_BASE_URL  = import.meta.env.VITE_WS_URL  || 'ws://localhost:8080/ws';

export const ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER:'/auth/register',
    MATCHES: '/matches',
    MATCH_BY_ID: (id) => `/matches/${id}`,
    PLAYERS: '/players',
    PLAYER_BY_ID: (id) => `/players/${id}`,
    SCORECARD: (matchId) => `/matches/${matchId}/scorecard`,
    DELIVERY: (matchId) => `/matches/${matchId}/delivery`,
    TOURNAMENTS: '/tournaments',
    PREDICT_SCORE: '/predict/score',

    TEAMS: '/teams',
    TEAM_BY_ID:(id) => `/teams/${id}`,
    INNINGS:(matchId) => `/matches/${matchId}/innings`,
    PLAYER_STATS: (id) => `/players/${id}/stats`,
    TOURNAMENT_BY_ID: (id) => `/tournaments/${id}`,
    TOURNAMENT_STANDINGS: (id) => `/tournaments/${id}/standings`,
    LIVE_SCORE: (matchId) => `/matches/${matchId}/live`,
    COMMENTRY: (matchId) => `/matches/${matchId}/commentary`,
};

export const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    SCORER: 'ROLE_SCORER',
    VIEWER: 'ROLE_VIEWER',
}

export const MATCH_FORMATS = [
   { value: 'T20', label:'T20', overs:20, isCustom:false},
    { value: 'ODI', label:'ODI', overs:50, isCustom:false},
     { value: 'TEST', label:'Test Match', overs:null, isCustom:false},
      { value: 'LOCAL_CUSTOM', label:'Local / Custom', overs:null, isCustom:true},

];

export const LOCAL_OVER_OPTIONS = [4,5,6,8,10,12,15,20];
export const CUSTOM_OVERS_MIN = 1;
export const CUSTOM_OVERS_MAX = 50;

export const DISMISSAL_TYPES = [
    { value: 'BOWLED' , label: 'Bowled'},
    { value: 'CAUGHT' , label: 'Caught'},
    { value: 'LBW' , label: 'LBW'},
    { value: 'RUN_OUT' , label: 'Run Out'},
    { value: 'STUMPED' , label: 'Stumped'},
    { value: 'HIT_WICKET' , label: 'Hit Wicket'},
    { value: 'OBSTRUCTING' , label: 'Obstructing the field'},
    { value: 'NOT_OUT' , label: 'Not Out'},
    
];

//Extras
export const EXTRA_TYPES = [
    {value :'WIDE' , label:'Wide'},
    {value :'NO_BALL' , label:'No Ball'},
    {value :'BYE' , label:'Bye'},
    {value :'LEG_BYE' , label:'Leg Bye'},
    {value :'PENALTY' , label:'Penalty'},
];

//Match Status
export const MATCH_STATUS = {
    UPCOMING: 'UPCOMING',
    LIVE: 'LIVE',
    COMPLETED: 'COMPLETED',
    ABANDONED: 'ABANDONED',
    RAIN_DELAY: 'RAIN_DELAY',
};
export const MATCH_STATUS_LABELS = {
    UPCOMING: {label:'Upcoming' ,color:'blue'},
    LIVE: {label:'Live' ,color:'green'},
    COMPLETED: {label:'Completed' ,color:'gray'},
    ABANDONED: {label:'Abandoned' ,color:'red'},
    RAIN_DELAY: {label:'Rain Delay',color:'amber'}

};

//Scoring
export const RUN_OPTIONS = [0,1,2,3,4,6];
export const MAX_WICKETS = 10;

//Toss
export const TOSS_DECISIONS = [
    {value: 'BAT' , label: 'Elected to Bat'},
    {value :'BOWL', label: 'Elected to Bowl'},
];

//Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5,10,20,50];

//Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'cricket_jwt_token',
    USER: 'cricket_user',
    THEME: 'cricket_theme',

};

//Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD:'/dashboard',
    MATCHES:'/matches',
    LIVE_MATCH:'/matches/:id/live',
    SCORECARD:'/matches/:id/scorecard',
    PLAYER_PROFILE:'/players/:id',
    TOURNAMENT: '/tournaments',
    ANALYTICS: '/analytics',
    ADMIN: '/admin',
};