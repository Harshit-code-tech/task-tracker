// NeetCode 150 problems data organized by categories
const neetcodeProblems = {
    "Arrays & Hashing": [
        { title: "Contains Duplicate", difficulty: "easy", url: "https://leetcode.com/problems/contains-duplicate/" },
        { title: "Valid Anagram", difficulty: "easy", url: "https://leetcode.com/problems/valid-anagram/" },
        { title: "Two Sum", difficulty: "easy", url: "https://leetcode.com/problems/two-sum/" },
        { title: "Group Anagrams", difficulty: "medium", url: "https://leetcode.com/problems/group-anagrams/" },
        { title: "Top K Frequent Elements", difficulty: "medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        { title: "Product of Array Except Self", difficulty: "medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
        { title: "Valid Sudoku", difficulty: "medium", url: "https://leetcode.com/problems/valid-sudoku/" },
        { title: "Encode and Decode Strings", difficulty: "medium", url: "https://leetcode.com/problems/encode-and-decode-strings/" },
        { title: "Longest Consecutive Sequence", difficulty: "medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" }
    ],
    "Two Pointers": [
        { title: "Valid Palindrome", difficulty: "easy", url: "https://leetcode.com/problems/valid-palindrome/" },
        { title: "Two Sum II", difficulty: "medium", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { title: "3Sum", difficulty: "medium", url: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", difficulty: "medium", url: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Trapping Rain Water", difficulty: "hard", url: "https://leetcode.com/problems/trapping-rain-water/" }
    ],
    "Sliding Window": [
        { title: "Best Time to Buy and Sell Stock", difficulty: "easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Longest Substring Without Repeating Characters", difficulty: "medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Longest Repeating Character Replacement", difficulty: "medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        { title: "Permutation in String", difficulty: "medium", url: "https://leetcode.com/problems/permutation-in-string/" },
        { title: "Minimum Window Substring", difficulty: "hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
        { title: "Sliding Window Maximum", difficulty: "hard", url: "https://leetcode.com/problems/sliding-window-maximum/" }
    ],
    "Stack": [
        { title: "Valid Parentheses", difficulty: "easy", url: "https://leetcode.com/problems/valid-parentheses/" },
        { title: "Min Stack", difficulty: "medium", url: "https://leetcode.com/problems/min-stack/" },
        { title: "Evaluate Reverse Polish Notation", difficulty: "medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { title: "Generate Parentheses", difficulty: "medium", url: "https://leetcode.com/problems/generate-parentheses/" },
        { title: "Daily Temperatures", difficulty: "medium", url: "https://leetcode.com/problems/daily-temperatures/" },
        { title: "Car Fleet", difficulty: "medium", url: "https://leetcode.com/problems/car-fleet/" },
        { title: "Largest Rectangle in Histogram", difficulty: "hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
    ],
    "Binary Search": [
        { title: "Binary Search", difficulty: "easy", url: "https://leetcode.com/problems/binary-search/" },
        { title: "Search a 2D Matrix", difficulty: "medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
        { title: "Koko Eating Bananas", difficulty: "medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
        { title: "Find Minimum in Rotated Sorted Array", difficulty: "medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { title: "Search in Rotated Sorted Array", difficulty: "medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { title: "Time Based Key-Value Store", difficulty: "medium", url: "https://leetcode.com/problems/time-based-key-value-store/" },
        { title: "Median of Two Sorted Arrays", difficulty: "hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" }
    ],
    "Linked List": [
        { title: "Reverse Linked List", difficulty: "easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
        { title: "Merge Two Sorted Lists", difficulty: "easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { title: "Reorder List", difficulty: "medium", url: "https://leetcode.com/problems/reorder-list/" },
        { title: "Remove Nth Node From End of List", difficulty: "medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
        { title: "Copy List with Random Pointer", difficulty: "medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
        { title: "Add Two Numbers", difficulty: "medium", url: "https://leetcode.com/problems/add-two-numbers/" },
        { title: "Linked List Cycle", difficulty: "easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
        { title: "Find the Duplicate Number", difficulty: "medium", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
        { title: "LRU Cache", difficulty: "medium", url: "https://leetcode.com/problems/lru-cache/" },
        { title: "Merge k Sorted Lists", difficulty: "hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
        { title: "Reverse Nodes in k-Group", difficulty: "hard", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" }
    ],
    "Trees": [
        { title: "Invert Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
        { title: "Maximum Depth of Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { title: "Diameter of Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
        { title: "Balanced Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/balanced-binary-tree/" },
        { title: "Same Tree", difficulty: "easy", url: "https://leetcode.com/problems/same-tree/" },
        { title: "Subtree of Another Tree", difficulty: "easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
        { title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
        { title: "Binary Tree Level Order Traversal", difficulty: "medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { title: "Binary Tree Right Side View", difficulty: "medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
        { title: "Count Good Nodes in Binary Tree", difficulty: "medium", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
        { title: "Validate Binary Search Tree", difficulty: "medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
        { title: "Kth Smallest Element in a BST", difficulty: "medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
        { title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
        { title: "Binary Tree Maximum Path Sum", difficulty: "hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
        { title: "Serialize and Deserialize Binary Tree", difficulty: "hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
    ],
    "Tries": [
        { title: "Implement Trie (Prefix Tree)", difficulty: "medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
        { title: "Design Add and Search Words Data Structure", difficulty: "medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
        { title: "Word Search II", difficulty: "hard", url: "https://leetcode.com/problems/word-search-ii/" }
    ],
    "Heap / Priority Queue": [
        { title: "Kth Largest Element in a Stream", difficulty: "easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
        { title: "Last Stone Weight", difficulty: "easy", url: "https://leetcode.com/problems/last-stone-weight/" },
        { title: "K Closest Points to Origin", difficulty: "medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
        { title: "Kth Largest Element in an Array", difficulty: "medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
        { title: "Task Scheduler", difficulty: "medium", url: "https://leetcode.com/problems/task-scheduler/" },
        { title: "Design Twitter", difficulty: "medium", url: "https://leetcode.com/problems/design-twitter/" },
        { title: "Find Median from Data Stream", difficulty: "hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" }
    ],
    "Backtracking": [
        { title: "Subsets", difficulty: "medium", url: "https://leetcode.com/problems/subsets/" },
        { title: "Combination Sum", difficulty: "medium", url: "https://leetcode.com/problems/combination-sum/" },
        { title: "Permutations", difficulty: "medium", url: "https://leetcode.com/problems/permutations/" },
        { title: "Subsets II", difficulty: "medium", url: "https://leetcode.com/problems/subsets-ii/" },
        { title: "Combination Sum II", difficulty: "medium", url: "https://leetcode.com/problems/combination-sum-ii/" },
        { title: "Word Search", difficulty: "medium", url: "https://leetcode.com/problems/word-search/" },
        { title: "Palindrome Partitioning", difficulty: "medium", url: "https://leetcode.com/problems/palindrome-partitioning/" },
        { title: "Letter Combinations of a Phone Number", difficulty: "medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
        { title: "N-Queens", difficulty: "hard", url: "https://leetcode.com/problems/n-queens/" }
    ],
    "Graphs": [
        { title: "Number of Islands", difficulty: "medium", url: "https://leetcode.com/problems/number-of-islands/" },
        { title: "Clone Graph", difficulty: "medium", url: "https://leetcode.com/problems/clone-graph/" },
        { title: "Max Area of Island", difficulty: "medium", url: "https://leetcode.com/problems/max-area-of-island/" },
        { title: "Pacific Atlantic Water Flow", difficulty: "medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
        { title: "Surrounded Regions", difficulty: "medium", url: "https://leetcode.com/problems/surrounded-regions/" },
        { title: "Rotting Oranges", difficulty: "medium", url: "https://leetcode.com/problems/rotting-oranges/" },
        { title: "Walls and Gates", difficulty: "medium", url: "https://leetcode.com/problems/walls-and-gates/" },
        { title: "Course Schedule", difficulty: "medium", url: "https://leetcode.com/problems/course-schedule/" },
        { title: "Course Schedule II", difficulty: "medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
        { title: "Redundant Connection", difficulty: "medium", url: "https://leetcode.com/problems/redundant-connection/" },
        { title: "Number of Connected Components in an Undirected Graph", difficulty: "medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
        { title: "Graph Valid Tree", difficulty: "medium", url: "https://leetcode.com/problems/graph-valid-tree/" },
        { title: "Word Ladder", difficulty: "hard", url: "https://leetcode.com/problems/word-ladder/" }
    ],
    "Advanced Graphs": [
        { title: "Reconstruct Itinerary", difficulty: "hard", url: "https://leetcode.com/problems/reconstruct-itinerary/" },
        { title: "Min Cost to Connect All Points", difficulty: "medium", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
        { title: "Network Delay Time", difficulty: "medium", url: "https://leetcode.com/problems/network-delay-time/" },
        { title: "Swim in Rising Water", difficulty: "hard", url: "https://leetcode.com/problems/swim-in-rising-water/" },
        { title: "Alien Dictionary", difficulty: "hard", url: "https://leetcode.com/problems/alien-dictionary/" },
        { title: "Cheapest Flights Within K Stops", difficulty: "medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" }
    ],
    "1-D Dynamic Programming": [
        { title: "Climbing Stairs", difficulty: "easy", url: "https://leetcode.com/problems/climbing-stairs/" },
        { title: "Min Cost Climbing Stairs", difficulty: "easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
        { title: "House Robber", difficulty: "medium", url: "https://leetcode.com/problems/house-robber/" },
        { title: "House Robber II", difficulty: "medium", url: "https://leetcode.com/problems/house-robber-ii/" },
        { title: "Longest Palindromic Substring", difficulty: "medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
        { title: "Palindromic Substrings", difficulty: "medium", url: "https://leetcode.com/problems/palindromic-substrings/" },
        { title: "Decode Ways", difficulty: "medium", url: "https://leetcode.com/problems/decode-ways/" },
        { title: "Coin Change", difficulty: "medium", url: "https://leetcode.com/problems/coin-change/" },
        { title: "Maximum Product Subarray", difficulty: "medium", url: "https://leetcode.com/problems/maximum-product-subarray/" },
        { title: "Word Break", difficulty: "medium", url: "https://leetcode.com/problems/word-break/" },
        { title: "Longest Increasing Subsequence", difficulty: "medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { title: "Partition Equal Subset Sum", difficulty: "medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" }
    ],
    "2-D Dynamic Programming": [
        { title: "Unique Paths", difficulty: "medium", url: "https://leetcode.com/problems/unique-paths/" },
        { title: "Longest Common Subsequence", difficulty: "medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
        { title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "medium", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
        { title: "Coin Change 2", difficulty: "medium", url: "https://leetcode.com/problems/coin-change-2/" },
        { title: "Target Sum", difficulty: "medium", url: "https://leetcode.com/problems/target-sum/" },
        { title: "Interleaving String", difficulty: "medium", url: "https://leetcode.com/problems/interleaving-string/" },
        { title: "Longest Increasing Path in a Matrix", difficulty: "hard", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
        { title: "Distinct Subsequences", difficulty: "hard", url: "https://leetcode.com/problems/distinct-subsequences/" },
        { title: "Edit Distance", difficulty: "hard", url: "https://leetcode.com/problems/edit-distance/" },
        { title: "Burst Balloons", difficulty: "hard", url: "https://leetcode.com/problems/burst-balloons/" },
        { title: "Regular Expression Matching", difficulty: "hard", url: "https://leetcode.com/problems/regular-expression-matching/" }
    ],
    "Greedy": [
        { title: "Maximum Subarray", difficulty: "medium", url: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Jump Game", difficulty: "medium", url: "https://leetcode.com/problems/jump-game/" },
        { title: "Jump Game II", difficulty: "medium", url: "https://leetcode.com/problems/jump-game-ii/" },
        { title: "Gas Station", difficulty: "medium", url: "https://leetcode.com/problems/gas-station/" },
        { title: "Hand of Straights", difficulty: "medium", url: "https://leetcode.com/problems/hand-of-straights/" },
        { title: "Merge Triplets to Form Target Triplet", difficulty: "medium", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
        { title: "Partition Labels", difficulty: "medium", url: "https://leetcode.com/problems/partition-labels/" },
        { title: "Valid Parenthesis String", difficulty: "medium", url: "https://leetcode.com/problems/valid-parenthesis-string/" }
    ],
    "Intervals": [
        { title: "Insert Interval", difficulty: "medium", url: "https://leetcode.com/problems/insert-interval/" },
        { title: "Merge Intervals", difficulty: "medium", url: "https://leetcode.com/problems/merge-intervals/" },
        { title: "Non-overlapping Intervals", difficulty: "medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
        { title: "Meeting Rooms", difficulty: "easy", url: "https://leetcode.com/problems/meeting-rooms/" },
        { title: "Meeting Rooms II", difficulty: "medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
        { title: "Minimum Interval to Include Each Query", difficulty: "hard", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" }
    ],
    "Math & Geometry": [
        { title: "Rotate Image", difficulty: "medium", url: "https://leetcode.com/problems/rotate-image/" },
        { title: "Spiral Matrix", difficulty: "medium", url: "https://leetcode.com/problems/spiral-matrix/" },
        { title: "Set Matrix Zeroes", difficulty: "medium", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
        { title: "Happy Number", difficulty: "easy", url: "https://leetcode.com/problems/happy-number/" },
        { title: "Plus One", difficulty: "easy", url: "https://leetcode.com/problems/plus-one/" },
        { title: "Pow(x, n)", difficulty: "medium", url: "https://leetcode.com/problems/powx-n/" },
        { title: "Multiply Strings", difficulty: "medium", url: "https://leetcode.com/problems/multiply-strings/" },
        { title: "Detect Squares", difficulty: "medium", url: "https://leetcode.com/problems/detect-squares/" }
    ],
    "Bit Manipulation": [
        { title: "Single Number", difficulty: "easy", url: "https://leetcode.com/problems/single-number/" },
        { title: "Number of 1 Bits", difficulty: "easy", url: "https://leetcode.com/problems/number-of-1-bits/" },
        { title: "Counting Bits", difficulty: "easy", url: "https://leetcode.com/problems/counting-bits/" },
        { title: "Reverse Bits", difficulty: "easy", url: "https://leetcode.com/problems/reverse-bits/" },
        { title: "Missing Number", difficulty: "easy", url: "https://leetcode.com/problems/missing-number/" },
        { title: "Sum of Two Integers", difficulty: "medium", url: "https://leetcode.com/problems/sum-of-two-integers/" },
        { title: "Reverse Integer", difficulty: "medium", url: "https://leetcode.com/problems/reverse-integer/" }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = neetcodeProblems;
}
