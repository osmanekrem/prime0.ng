const config = {
    env: {
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
        databaseUrl: process.env.DATABASE_URL!,
        resendApiKey: process.env.RESEND_API_KEY!,
    },
};

export default config;
