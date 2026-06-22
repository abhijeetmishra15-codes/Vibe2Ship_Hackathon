// Mock Database with LocalStorage persistence for the hackathon demo

const SEED_ISSUES = [
  {
    id: "issue-1",
    title: "Deep Pothole on Sector 15 Main Road",
    description: "A large, deep pothole has formed in the middle lane, causing cars to swerve dangerously. It is about 8 inches deep and filled with rainwater, making it hard to see at night.",
    category: "Pothole",
    severity: "critical",
    status: "open",
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: "Sector 15 Main Rd, near Metro Station, Noida"
    },
    reporter: {
      id: "user-cit-1",
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      points: 240,
      role: "citizen"
    },
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    video: null,
    upvotes: ["user-cit-2", "user-cit-3", "user-ver-1"],
    verifications: [],
    comments: [
      {
        id: "c-1",
        userName: "Priya Patel",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        content: "Saw a bike almost crash here this morning. Please drive carefully!",
        role: "citizen",
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ],
    timeline: [
      {
        status: "open",
        title: "Issue Reported",
        description: "Reported by Aarav Sharma with GPS coordinates.",
        date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updatedBy: "Aarav Sharma"
      }
    ],
    duplicateOf: null,
    confidenceScore: 0.95,
    resolutionUpdate: null
  },
  {
    id: "issue-2",
    title: "Overflowing Garbage Bin near City Park",
    description: "The commercial garbage bin has not been cleared for 4 days. Street dogs are scattering waste across the walking path, causing severe foul smell and health hazard.",
    category: "Garbage",
    severity: "high",
    status: "verifying",
    location: {
      lat: 28.5420,
      lng: 77.4020,
      address: "Gate 2 Road, City Park, Noida"
    },
    reporter: {
      id: "user-cit-2",
      name: "Neha Gupta",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      points: 150,
      role: "citizen"
    },
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    video: null,
    upvotes: ["user-cit-1", "user-ver-1"],
    verifications: [
      {
        verifierId: "user-ver-1",
        verifierName: "Vikram Singh (Verifier)",
        status: "verified",
        notes: "Verified on-site. The bin is completely full and garbage has spread over a 10-meter radius.",
        evidenceImage: "https://images.unsplash.com/photo-1605600656308-972bad4e8ee6?auto=format&fit=crop&w=600&q=80",
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      }
    ],
    comments: [
      {
        id: "c-2",
        userName: "Vikram Singh",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "I have added verification. The municipal garbage truck usually arrives on Wednesdays, but it seems they missed this stop.",
        role: "verifier",
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      }
    ],
    timeline: [
      {
        status: "open",
        title: "Issue Reported",
        description: "Reported by Neha Gupta.",
        date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        updatedBy: "Neha Gupta"
      },
      {
        status: "verifying",
        title: "Community Verification Initiated",
        description: "First verification verification submitted by Vikram Singh.",
        date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        updatedBy: "Vikram Singh"
      }
    ],
    duplicateOf: null,
    confidenceScore: 0.98,
    resolutionUpdate: null
  },
  {
    id: "issue-3",
    title: "Major Water Pipe Leakage",
    description: "Drinking water pipe cracked under the sidewalk, wasting thousands of liters of clean water. Water has accumulated on the side road, creating a breeding ground for mosquitoes.",
    category: "Water Leakage",
    severity: "medium",
    status: "resolved",
    location: {
      lat: 28.5300,
      lng: 77.3800,
      address: "A-Block Road, Sector 22, Noida"
    },
    reporter: {
      id: "user-cit-3",
      name: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      points: 80,
      role: "citizen"
    },
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    video: null,
    upvotes: ["user-cit-1", "user-cit-2", "user-ver-1", "user-admin-1"],
    verifications: [
      {
        verifierId: "user-ver-1",
        verifierName: "Vikram Singh (Verifier)",
        status: "verified",
        notes: "Water is leaking under pressure. Needs immediate plumbing action.",
        evidenceImage: null,
        createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
      }
    ],
    comments: [
      {
        id: "c-3",
        userName: "MuniAdmin",
        userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        content: "Plumbing team dispatched. Scheduled repair is set for tomorrow morning.",
        role: "admin",
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      }
    ],
    timeline: [
      {
        status: "open",
        title: "Issue Reported",
        description: "Reported by Rahul Verma.",
        date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        updatedBy: "Rahul Verma"
      },
      {
        status: "verifying",
        title: "Verified",
        description: "Verified by Vikram Singh.",
        date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        updatedBy: "Vikram Singh"
      },
      {
        status: "resolved",
        title: "Resolved by Authority",
        description: "Pipe leak repaired, sidewalk patched. Water flow restored.",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updatedBy: "Noida Jal Board (Admin)"
      }
    ],
    duplicateOf: null,
    confidenceScore: 0.91,
    resolutionUpdate: {
      updatedBy: "Noida Jal Board (Admin)",
      content: "The underground pipe junction was replaced and sealed. Road patching has been done. Photos attached.",
      image: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=600&q=80",
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  },
  {
    id: "issue-4",
    title: "Broken Streetlight on Park Lane",
    description: "The entire stretch of streetlights near block C park is dark. Extremely unsafe for women and children who walk there in the evenings.",
    category: "Streetlight",
    severity: "high",
    status: "open",
    location: {
      lat: 28.5480,
      lng: 77.3850,
      address: "Park Lane, Sector 30, Noida"
    },
    reporter: {
      id: "user-cit-2",
      name: "Neha Gupta",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      points: 150,
      role: "citizen"
    },
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    video: null,
    upvotes: ["user-cit-1"],
    verifications: [],
    comments: [],
    timeline: [
      {
        status: "open",
        title: "Issue Reported",
        description: "Reported by Neha Gupta.",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updatedBy: "Neha Gupta"
      }
    ],
    duplicateOf: null,
    confidenceScore: 0.88,
    resolutionUpdate: null
  }
];

const SEED_LEADERBOARD = [
  { rank: 1, name: "Aarav Sharma", points: 240, reports: 12, verifications: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", badges: ["Pothole Buster", "Early Bird", "Local Guide"] },
  { rank: 2, name: "Neha Gupta", points: 150, reports: 8, verifications: 2, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", badges: ["Green Guardian", "Civic Star"] },
  { rank: 3, name: "Vikram Singh", points: 130, reports: 2, verifications: 15, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", badges: ["Elite Verifier", "First Responder"] },
  { rank: 4, name: "Rahul Verma", points: 80, reports: 5, verifications: 1, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", badges: ["Water Saver"] },
  { rank: 5, name: "Amit Patel", points: 65, reports: 3, verifications: 2, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", badges: ["Clean Streets"] }
];

const SEED_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Issue Resolved! 🎉",
    description: "The 'Major Water Pipe Leakage' issue you followed has been resolved by Noida Jal Board.",
    type: "resolution",
    issueId: "issue-3",
    read: false,
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "n-2",
    title: "New Verification Request 🔍",
    description: "There is an unverified 'Overflowing Garbage Bin' issue near your location.",
    type: "verification_request",
    issueId: "issue-2",
    read: false,
    date: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: "n-3",
    title: "Community points gained! 💎",
    description: "You earned 15 community points as your report was upvoted by Vikram Singh.",
    type: "points",
    issueId: "issue-2",
    read: true,
    date: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

// Initialize localStorage values if they don't exist
const initDb = () => {
  if (!localStorage.getItem("ch_issues")) {
    localStorage.setItem("ch_issues", JSON.stringify(SEED_ISSUES));
  }
  if (!localStorage.getItem("ch_leaderboard")) {
    localStorage.setItem("ch_leaderboard", JSON.stringify(SEED_LEADERBOARD));
  }
  if (!localStorage.getItem("ch_notifications")) {
    localStorage.setItem("ch_notifications", JSON.stringify(SEED_NOTIFICATIONS));
  }
};

initDb();

// Helper to simulate network latency
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDb = {
  // Issues API
  getIssues: async () => {
    await delay();
    return JSON.parse(localStorage.getItem("ch_issues"));
  },

  getIssueById: async (id) => {
    await delay();
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    return issues.find(i => i.id === id) || null;
  },

  createIssue: async (issueData) => {
    await delay(1000); // Simulate upload latency
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    const newIssue = {
      id: `issue-${Date.now()}`,
      title: issueData.title,
      description: issueData.description,
      category: issueData.category,
      severity: issueData.severity || "medium",
      status: "open",
      location: issueData.location,
      reporter: issueData.reporter,
      createdAt: new Date().toISOString(),
      image: issueData.image || "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80",
      video: issueData.video || null,
      upvotes: [],
      verifications: [],
      comments: [],
      timeline: [
        {
          status: "open",
          title: "Issue Reported",
          description: `Reported by ${issueData.reporter.name}.`,
          date: new Date().toISOString(),
          updatedBy: issueData.reporter.name
        }
      ],
      duplicateOf: issueData.duplicateOf || null,
      confidenceScore: issueData.confidenceScore || 0.90,
      resolutionUpdate: null
    };

    issues.unshift(newIssue);
    localStorage.setItem("ch_issues", JSON.stringify(issues));

    // Update leaderboard report count for the user
    const leaderboard = JSON.parse(localStorage.getItem("ch_leaderboard"));
    const idx = leaderboard.findIndex(u => u.name === issueData.reporter.name);
    if (idx !== -1) {
      leaderboard[idx].reports += 1;
      leaderboard[idx].points += 15; // 15 points for submitting a report
      localStorage.setItem("ch_leaderboard", JSON.stringify(leaderboard));
    }

    return newIssue;
  },

  upvoteIssue: async (issueId, userId) => {
    await delay(200);
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      const idx = issue.upvotes.indexOf(userId);
      if (idx === -1) {
        issue.upvotes.push(userId);
        // Award points to reporter
        const leaderboard = JSON.parse(localStorage.getItem("ch_leaderboard"));
        const repIdx = leaderboard.findIndex(u => u.name === issue.reporter.name);
        if (repIdx !== -1) {
          leaderboard[repIdx].points += 5; // 5 points per upvote
          localStorage.setItem("ch_leaderboard", JSON.stringify(leaderboard));
        }
      } else {
        issue.upvotes.splice(idx, 1);
      }
      localStorage.setItem("ch_issues", JSON.stringify(issues));
    }
    return issue;
  },

  verifyIssue: async (issueId, verificationData) => {
    await delay(800);
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      const isDuplicate = verificationData.status === "duplicate";
      
      const newVerification = {
        verifierId: verificationData.verifierId,
        verifierName: verificationData.verifierName,
        status: verificationData.status, // "verified", "rejected", "duplicate"
        notes: verificationData.notes,
        evidenceImage: verificationData.evidenceImage || null,
        createdAt: new Date().toISOString()
      };

      issue.verifications.push(newVerification);
      
      if (isDuplicate) {
        issue.duplicateOf = verificationData.duplicateOf;
        issue.status = "rejected";
        issue.timeline.push({
          status: "rejected",
          title: "Flagged as Duplicate",
          description: `Flagged as duplicate of ${verificationData.duplicateOf} by ${verificationData.verifierName}.`,
          date: new Date().toISOString(),
          updatedBy: verificationData.verifierName
        });
      } else {
        issue.status = "verifying"; // Move to verifying or verified phase
        issue.timeline.push({
          status: "verifying",
          title: verificationData.status === "verified" ? "Verified by Verifier" : "Rejected by Verifier",
          description: verificationData.notes,
          date: new Date().toISOString(),
          updatedBy: verificationData.verifierName
        });
      }

      localStorage.setItem("ch_issues", JSON.stringify(issues));

      // Award verifier points
      const leaderboard = JSON.parse(localStorage.getItem("ch_leaderboard"));
      const vidx = leaderboard.findIndex(u => u.name.includes(verificationData.verifierName.split(" ")[0]));
      if (vidx !== -1) {
        leaderboard[vidx].verifications += 1;
        leaderboard[vidx].points += 20; // 20 points for verification
        localStorage.setItem("ch_leaderboard", JSON.stringify(leaderboard));
      }
    }
    return issue;
  },

  resolveIssue: async (issueId, adminName, resolutionData) => {
    await delay(1000);
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = "resolved";
      issue.resolutionUpdate = {
        updatedBy: adminName,
        content: resolutionData.content,
        image: resolutionData.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
        date: new Date().toISOString()
      };
      
      issue.timeline.push({
        status: "resolved",
        title: "Issue Resolved",
        description: resolutionData.content,
        date: new Date().toISOString(),
        updatedBy: adminName
      });

      localStorage.setItem("ch_issues", JSON.stringify(issues));

      // Push notification to reporter
      const notifications = JSON.parse(localStorage.getItem("ch_notifications"));
      notifications.unshift({
        id: `n-${Date.now()}`,
        title: "Your report has been resolved! 🎉",
        description: `The issue '${issue.title}' has been fixed. Thank you for your contribution!`,
        type: "resolution",
        issueId: issue.id,
        read: false,
        date: new Date().toISOString()
      });
      localStorage.setItem("ch_notifications", JSON.stringify(notifications));

      // Award bonus points to reporter for successful resolution
      const leaderboard = JSON.parse(localStorage.getItem("ch_leaderboard"));
      const idx = leaderboard.findIndex(u => u.name === issue.reporter.name);
      if (idx !== -1) {
        leaderboard[idx].points += 50; // 50 bonus points for resolution
        localStorage.setItem("ch_leaderboard", JSON.stringify(leaderboard));
      }
    }
    return issue;
  },

  addComment: async (issueId, commentData) => {
    await delay(300);
    const issues = JSON.parse(localStorage.getItem("ch_issues"));
    const issue = issues.find(i => i.id === issueId);
    let newComment = null;
    if (issue) {
      newComment = {
        id: `c-${Date.now()}`,
        userName: commentData.userName,
        userAvatar: commentData.userAvatar,
        content: commentData.content,
        role: commentData.role,
        createdAt: new Date().toISOString()
      };
      issue.comments.push(newComment);
      localStorage.setItem("ch_issues", JSON.stringify(issues));
    }
    return newComment;
  },

  // Notifications API
  getNotifications: async () => {
    await delay(200);
    return JSON.parse(localStorage.getItem("ch_notifications"));
  },

  markNotificationsRead: async () => {
    const notifications = JSON.parse(localStorage.getItem("ch_notifications"));
    notifications.forEach(n => n.read = true);
    localStorage.setItem("ch_notifications", JSON.stringify(notifications));
    return notifications;
  },

  // Leaderboard API
  getLeaderboard: async () => {
    await delay(300);
    const leaderboard = JSON.parse(localStorage.getItem("ch_leaderboard"));
    return leaderboard.sort((a, b) => b.points - a.points);
  }
};
