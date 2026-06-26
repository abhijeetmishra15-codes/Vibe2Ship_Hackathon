import { getIssuesFromSupabase, getIssueById } from './src/services/issues.js';

async function test() {
  console.log("Testing getIssuesFromSupabase...");
  try {
    const issues = await getIssuesFromSupabase();
    console.log("Issues retrieved:", issues.length);
  } catch (err) {
    console.error("Issues Feed Error:", err);
  }

  console.log("\nTesting getIssueById...");
  try {
    // b562e919-cf25-4cc3-a1dc-0ea44ee49660 is an ID we saw earlier
    const issue = await getIssueById('b562e919-cf25-4cc3-a1dc-0ea44ee49660');
    console.log("Issue details retrieved successfully:", !!issue);
  } catch (err) {
    console.error("Issue Details Error:", err);
  }
}

test();
