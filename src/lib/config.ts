const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    databaseUrl: (() => {
      const v = process.env.DATABASE_URL;
      return v;
    })(),
    resendApiKey: (() => {
      const v = process.env.RESEND_API_KEY;
      return v;
    })(),
  },
};

export default config;
