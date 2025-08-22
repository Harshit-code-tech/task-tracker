// DSA Problems from array_courses.md organized by categories
const dsaProblems = {
    "Arrays & Lists": [
        { title: "Two Sum", leetcode: 1, difficulty: "easy", url: "https://leetcode.com/problems/two-sum/" },
        { title: "Best Time to Buy and Sell Stock", leetcode: 121, difficulty: "easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Contains Duplicate", leetcode: 217, difficulty: "easy", url: "https://leetcode.com/problems/contains-duplicate/" },
        { title: "Product of Array Except Self", leetcode: 238, difficulty: "medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
        { title: "Maximum Subarray", leetcode: 53, difficulty: "medium", url: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Three Sum", leetcode: 15, difficulty: "medium", url: "https://leetcode.com/problems/3sum/" },
        { title: "Trapping Rain Water", leetcode: 42, difficulty: "hard", url: "https://leetcode.com/problems/trapping-rain-water/" }
    ],
    "Strings": [
        { title: "Valid Palindrome", leetcode: 125, difficulty: "easy", url: "https://leetcode.com/problems/valid-palindrome/" },
        { title: "Longest Substring Without Repeating", leetcode: 3, difficulty: "medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Group Anagrams", leetcode: 49, difficulty: "medium", url: "https://leetcode.com/problems/group-anagrams/" },
        { title: "Longest Palindromic Substring", leetcode: 5, difficulty: "medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
        { title: "Minimum Window Substring", leetcode: 76, difficulty: "hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
        { title: "Implement strStr()", leetcode: 28, difficulty: "easy", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
        { title: "Decode String", leetcode: 394, difficulty: "medium", url: "https://leetcode.com/problems/decode-string/" }
    ],
    "Linked List": [
        { title: "Reverse Linked List", leetcode: 206, difficulty: "easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
        { title: "Merge Two Sorted Lists", leetcode: 21, difficulty: "easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { title: "Linked List Cycle", leetcode: 141, difficulty: "easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
        { title: "Add Two Numbers", leetcode: 2, difficulty: "medium", url: "https://leetcode.com/problems/add-two-numbers/" },
        { title: "Remove Nth Node From End of List", leetcode: 19, difficulty: "medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
        { title: "Reorder List", leetcode: 143, difficulty: "medium", url: "https://leetcode.com/problems/reorder-list/" },
        { title: "Merge k Sorted Lists", leetcode: 23, difficulty: "hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" }
    ],
    "Stacks / Queues": [
        { title: "Valid Parentheses", leetcode: 20, difficulty: "easy", url: "https://leetcode.com/problems/valid-parentheses/" },
        { title: "Min Stack", leetcode: 155, difficulty: "medium", url: "https://leetcode.com/problems/min-stack/" },
        { title: "Implement Queue using Stacks", leetcode: 232, difficulty: "easy", url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
        { title: "Daily Temperatures", leetcode: 739, difficulty: "medium", url: "https://leetcode.com/problems/daily-temperatures/" },
        { title: "Next Greater Element I", leetcode: 496, difficulty: "easy", url: "https://leetcode.com/problems/next-greater-element-i/" },
        { title: "Evaluate Reverse Polish Notation", leetcode: 150, difficulty: "medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { title: "Sliding Window Maximum", leetcode: 239, difficulty: "hard", url: "https://leetcode.com/problems/sliding-window-maximum/" }
    ],
    "Backtracking": [
        { title: "Permutations", leetcode: 46, difficulty: "medium", url: "https://leetcode.com/problems/permutations/" },
        { title: "Subsets", leetcode: 78, difficulty: "medium", url: "https://leetcode.com/problems/subsets/" },
        { title: "Combination Sum", leetcode: 39, difficulty: "medium", url: "https://leetcode.com/problems/combination-sum/" },
        { title: "Word Search", leetcode: 79, difficulty: "medium", url: "https://leetcode.com/problems/word-search/" },
        { title: "Palindrome Partitioning", leetcode: 131, difficulty: "medium", url: "https://leetcode.com/problems/palindrome-partitioning/" },
        { title: "Sudoku Solver", leetcode: 37, difficulty: "hard", url: "https://leetcode.com/problems/sudoku-solver/" },
        { title: "N-Queens", leetcode: 51, difficulty: "hard", url: "https://leetcode.com/problems/n-queens/" }
    ],
    "Trees & BST": [
        { title: "Maximum Depth of Binary Tree", leetcode: 104, difficulty: "easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { title: "Same Tree", leetcode: 100, difficulty: "easy", url: "https://leetcode.com/problems/same-tree/" },
        { title: "Symmetric Tree", leetcode: 101, difficulty: "easy", url: "https://leetcode.com/problems/symmetric-tree/" },
        { title: "Binary Tree Level Order Traversal", leetcode: 102, difficulty: "medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { title: "Validate Binary Search Tree", leetcode: 98, difficulty: "medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
        { title: "Kth Smallest Element in a BST", leetcode: 230, difficulty: "medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
        { title: "Serialize and Deserialize Binary Tree", leetcode: 297, difficulty: "hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
    ],
    "Graphs": [
        { title: "Number of Islands", leetcode: 200, difficulty: "medium", url: "https://leetcode.com/problems/number-of-islands/" },
        { title: "Flood Fill", leetcode: 733, difficulty: "easy", url: "https://leetcode.com/problems/flood-fill/" },
        { title: "Clone Graph", leetcode: 133, difficulty: "medium", url: "https://leetcode.com/problems/clone-graph/" },
        { title: "Course Schedule", leetcode: 207, difficulty: "medium", url: "https://leetcode.com/problems/course-schedule/" },
        { title: "Pacific Atlantic Water Flow", leetcode: 417, difficulty: "medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
        { title: "Word Ladder", leetcode: 127, difficulty: "hard", url: "https://leetcode.com/problems/word-ladder/" },
        { title: "Critical Connections in a Network", leetcode: 1192, difficulty: "hard", url: "https://leetcode.com/problems/critical-connections-in-a-network/" }
    ],
    "Bit Manipulation": [
        { title: "Single Number", leetcode: 136, difficulty: "easy", url: "https://leetcode.com/problems/single-number/" },
        { title: "Number of 1 Bits", leetcode: 191, difficulty: "easy", url: "https://leetcode.com/problems/number-of-1-bits/" },
        { title: "Reverse Bits", leetcode: 190, difficulty: "easy", url: "https://leetcode.com/problems/reverse-bits/" },
        { title: "Missing Number", leetcode: 268, difficulty: "easy", url: "https://leetcode.com/problems/missing-number/" },
        { title: "Power of Two", leetcode: 231, difficulty: "easy", url: "https://leetcode.com/problems/power-of-two/" },
        { title: "Subsets (using bits)", leetcode: 78, difficulty: "medium", url: "https://leetcode.com/problems/subsets/" },
        { title: "Maximum XOR of Two Numbers in Array", leetcode: 421, difficulty: "medium", url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" }
    ],
    "Dynamic Programming": [
        { title: "Climbing Stairs", leetcode: 70, difficulty: "easy", url: "https://leetcode.com/problems/climbing-stairs/" },
        { title: "House Robber", leetcode: 198, difficulty: "medium", url: "https://leetcode.com/problems/house-robber/" },
        { title: "Best Time to Buy and Sell Stock", leetcode: 121, difficulty: "easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Longest Increasing Subsequence", leetcode: 300, difficulty: "medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { title: "Coin Change", leetcode: 322, difficulty: "medium", url: "https://leetcode.com/problems/coin-change/" },
        { title: "Unique Paths", leetcode: 62, difficulty: "medium", url: "https://leetcode.com/problems/unique-paths/" },
        { title: "Longest Valid Parentheses", leetcode: 32, difficulty: "hard", url: "https://leetcode.com/problems/longest-valid-parentheses/" }
    ]
};

// Algorithms from the course
const algorithms = [
    { name: "Linear Search", level: "beginner", completed: false },
    { name: "Binary Search", level: "beginner", completed: false },
    { name: "Bubble Sort", level: "beginner", completed: false },
    { name: "Selection Sort", level: "beginner", completed: false },
    { name: "Insertion Sort", level: "beginner", completed: false },
    { name: "Merge Sort", level: "beginner", completed: false },
    { name: "Quick Sort", level: "beginner", completed: false },
    { name: "Two Pointers Technique", level: "beginner", completed: false },
    { name: "Sliding Window Technique", level: "beginner", completed: false },
    { name: "Kadane's Algorithm", level: "beginner", completed: false },
    { name: "Prefix Sum and Difference Arrays", level: "beginner", completed: false },
    { name: "Flood Fill Algorithm", level: "beginner", completed: false },
    { name: "Hashing (Maps, Sets, Frequency Count)", level: "intermediate", completed: false },
    { name: "Heap/Priority Queue Algorithms", level: "intermediate", completed: false },
    { name: "Counting Sort and Bucket Sort", level: "intermediate", completed: false },
    { name: "Binary Search on Answer", level: "intermediate", completed: false },
    { name: "Union-Find/Disjoint Set Union", level: "intermediate", completed: false },
    { name: "KMP Algorithm", level: "intermediate", completed: false },
    { name: "Rabin-Karp Algorithm", level: "intermediate", completed: false },
    { name: "DFS and BFS", level: "intermediate", completed: false },
    { name: "Topological Sort", level: "intermediate", completed: false },
    { name: "Dijkstra's Algorithm", level: "intermediate", completed: false },
    { name: "Bellman-Ford Algorithm", level: "intermediate", completed: false },
    { name: "Floyd-Warshall Algorithm", level: "intermediate", completed: false },
    { name: "Backtracking", level: "advanced", completed: false },
    { name: "Dynamic Programming on Subsets", level: "advanced", completed: false },
    { name: "Dynamic Programming on Strings", level: "advanced", completed: false },
    { name: "Dynamic Programming on Grids", level: "advanced", completed: false },
    { name: "Segment Trees", level: "advanced", completed: false },
    { name: "Fenwick Tree/Binary Indexed Tree", level: "advanced", completed: false },
    { name: "Trie (Prefix Tree)", level: "advanced", completed: false },
    { name: "Suffix Arrays and LCP Array", level: "advanced", completed: false },
    { name: "Manacher's Algorithm", level: "advanced", completed: false },
    { name: "Shortest Path in a DAG", level: "advanced", completed: false },
    { name: "Bit Manipulation Algorithms", level: "advanced", completed: false }
];

// Online learning resources
const learningResources = [
    {
        name: "Microsoft Learn",
        description: "Cloud computing, Azure, Power Platform, AI",
        url: "https://learn.microsoft.com/en-us/training/",
        category: "Cloud & Tech",
        icon: "fab fa-microsoft"
    },
    {
        name: "IBM SkillsBuild",
        description: "AI, cybersecurity, IT fundamentals, data science",
        url: "https://www.ibm.com/skillsbuild",
        category: "Tech & AI",
        icon: "fas fa-robot"
    },
    {
        name: "HubSpot Academy",
        description: "Marketing, sales, customer service, CRM",
        url: "https://academy.hubspot.com/",
        category: "Business",
        icon: "fas fa-chart-line"
    },
    {
        name: "Coursera",
        description: "University-level courses in all domains",
        url: "https://www.coursera.org",
        category: "Academic",
        icon: "fas fa-university"
    },
    {
        name: "edX",
        description: "Academic and professional topics from top universities",
        url: "https://www.edx.org/",
        category: "Academic",
        icon: "fas fa-graduation-cap"
    },
    {
        name: "Google Digital Garage",
        description: "Digital marketing, career development, data & tech",
        url: "https://learndigital.withgoogle.com/digitalgarage",
        category: "Digital Marketing",
        icon: "fab fa-google"
    },
    {
        name: "Google Cloud Skills Boost",
        description: "Cloud computing, machine learning, DevOps",
        url: "https://www.cloudskillsboost.google",
        category: "Cloud & Tech",
        icon: "fas fa-cloud"
    },
    {
        name: "Great Learning Academy",
        description: "Data science, digital marketing, coding, cloud",
        url: "https://www.mygreatlearning.com/academy",
        category: "Tech & Data",
        icon: "fas fa-code"
    },
    {
        name: "OpenLearn",
        description: "Broad range including health, education, science",
        url: "https://www.open.edu/openlearn/",
        category: "General",
        icon: "fas fa-book-open"
    },
    {
        name: "FutureLearn",
        description: "Business, healthcare, teaching, data, culture",
        url: "https://www.futurelearn.com/",
        category: "Professional",
        icon: "fas fa-lightbulb"
    },
    {
        name: "Meta Blueprint",
        description: "Social media marketing, advertising, branding",
        url: "https://www.facebook.com/business/learn",
        category: "Social Media",
        icon: "fab fa-facebook"
    },
    {
        name: "LinkedIn Learning",
        description: "Business, tech, creative skills, productivity",
        url: "https://www.linkedin.com/learning/",
        category: "Professional",
        icon: "fab fa-linkedin"
    },
    {
        name: "Kaggle Learn",
        description: "Data science, machine learning, Python, SQL",
        url: "https://www.kaggle.com/learn",
        category: "Data Science",
        icon: "fas fa-database"
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { dsaProblems, algorithms, learningResources };
}
