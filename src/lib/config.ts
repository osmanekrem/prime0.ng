const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    databaseUrl: (() => {
      const v = process.env.DATABASE_URL;
      if (!v) throw new Error("DATABASE_URL is not set");
      return v;
    })(),
    resendApiKey: (() => {
      const v = process.env.RESEND_API_KEY;
      if (!v) throw new Error("RESEND_API_KEY is not set");
      return v;
    })(),
  },
};

export default config;
