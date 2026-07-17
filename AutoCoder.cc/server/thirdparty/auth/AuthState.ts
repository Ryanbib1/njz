export interface AuthState {
    provider: string;
    projectId: string;
    successRedirectUrl: string;
    failedRedirectUrl?: string;
    nonce?: string;
    oauthStatsMode?: 'prod' | 'test';
    [key: string]: any;
}
