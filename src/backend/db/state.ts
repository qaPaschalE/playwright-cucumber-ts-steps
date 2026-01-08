// Holds the user's custom DB function
let dbAdapter: ((query: string) => Promise<any>) | null = null;
let lastResult: any = null;

export const dbState = {
  // Runner calls this to register the user's function
  setAdapter: (fn: (query: string) => Promise<any>) => {
    dbAdapter = fn;
  },

  // Step calls this to run a query
  executeQuery: async (query: string) => {
    if (!dbAdapter) {
      throw new Error(
        "❌ No Database Adapter found. Pass a 'dbQuery' function to runTests()."
      );
    }
    const result = await dbAdapter(query);
    lastResult = result;
    console.log(`🗄️ DB Result:`, JSON.stringify(lastResult));
    return result;
  },

  // Assertions use this to check results
  getLastResult: () => lastResult,
};
