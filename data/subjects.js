const subjects = {
  dsa: {
    name: "Data Structures & Algorithms",
    icon: "🔢",
    description: "Master fundamental data structures and algorithmic problem-solving techniques",
    topics: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Sorting", "Searching", "Dynamic Programming"],
    questions: [
      {
        id: "dsa_1",
        question: "What is the time complexity of binary search?",
        type: "multiple-choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "Binary search has O(log n) time complexity because it divides the search space in half with each iteration.",
        difficulty: "beginner",
        topic: "Searching"
      },
      {
        id: "dsa_2",
        question: "Which data structure follows LIFO principle?",
        type: "multiple-choice",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO (Last In, First Out) principle where the last element added is the first one to be removed.",
        difficulty: "beginner",
        topic: "Stacks & Queues"
      },
      {
        id: "dsa_3",
        question: "What is the worst-case time complexity of quicksort?",
        type: "multiple-choice",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Quicksort has O(n²) worst-case time complexity when the pivot is always the smallest or largest element.",
        difficulty: "intermediate",
        topic: "Sorting"
      },
      {
        id: "dsa_4",
        question: "Explain the difference between BFS and DFS traversal algorithms.",
        type: "essay",
        explanation: "BFS explores all neighbors at the current depth before moving to the next level, while DFS explores as far as possible along each branch before backtracking.",
        difficulty: "intermediate",
        topic: "Graphs"
      },
      {
        id: "dsa_5",
        question: "What is the space complexity of merge sort?",
        type: "multiple-choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Merge sort requires O(n) additional space to store the merged subarrays during the sorting process.",
        difficulty: "intermediate",
        topic: "Sorting"
      }
    ]
  },
  cn: {
    name: "Computer Networks",
    icon: "🌐",
    description: "Understand network protocols, architectures, and communication systems",
    topics: ["OSI Model", "TCP/IP", "HTTP/HTTPS", "DNS", "Routing", "Security", "Wireless Networks"],
    questions: [
      {
        id: "cn_1",
        question: "Which layer of the OSI model is responsible for routing?",
        type: "multiple-choice",
        options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        correctAnswer: 2,
        explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks.",
        difficulty: "beginner",
        topic: "OSI Model"
      },
      {
        id: "cn_2",
        question: "What is the default port number for HTTPS?",
        type: "multiple-choice",
        options: ["80", "443", "8080", "21"],
        correctAnswer: 1,
        explanation: "HTTPS uses port 443 by default, while HTTP uses port 80.",
        difficulty: "beginner",
        topic: "HTTP/HTTPS"
      },
      {
        id: "cn_3",
        question: "Explain the difference between TCP and UDP protocols.",
        type: "essay",
        explanation: "TCP is connection-oriented, reliable, and provides error checking, while UDP is connectionless, unreliable, and faster but without error checking.",
        difficulty: "intermediate",
        topic: "TCP/IP"
      },
      {
        id: "cn_4",
        question: "What is DNS and how does it work?",
        type: "essay",
        explanation: "DNS (Domain Name System) translates human-readable domain names into IP addresses using a hierarchical distributed database system.",
        difficulty: "intermediate",
        topic: "DNS"
      },
      {
        id: "cn_5",
        question: "Which protocol is used for secure file transfer?",
        type: "multiple-choice",
        options: ["FTP", "SFTP", "HTTP", "SMTP"],
        correctAnswer: 1,
        explanation: "SFTP (SSH File Transfer Protocol) provides secure file transfer over SSH connection.",
        difficulty: "intermediate",
        topic: "Security"
      }
    ]
  },
  os: {
    name: "Operating Systems",
    icon: "💻",
    description: "Learn about process management, memory systems, and OS fundamentals",
    topics: ["Process Management", "Memory Management", "File Systems", "Scheduling", "Deadlocks", "Virtual Memory"],
    questions: [
      {
        id: "os_1",
        question: "What is a deadlock and what are its necessary conditions?",
        type: "essay",
        explanation: "A deadlock occurs when two or more processes are blocked waiting for resources held by each other. The four necessary conditions are: mutual exclusion, hold and wait, no preemption, and circular wait.",
        difficulty: "intermediate",
        topic: "Deadlocks"
      },
      {
        id: "os_2",
        question: "Which scheduling algorithm provides the shortest average waiting time?",
        type: "multiple-choice",
        options: ["First Come First Serve", "Shortest Job First", "Round Robin", "Priority Scheduling"],
        correctAnswer: 1,
        explanation: "Shortest Job First (SJF) provides the shortest average waiting time among all scheduling algorithms.",
        difficulty: "intermediate",
        topic: "Scheduling"
      },
      {
        id: "os_3",
        question: "What is virtual memory?",
        type: "essay",
        explanation: "Virtual memory is a memory management technique that allows a computer to use more memory than physically available by using disk space as an extension of RAM.",
        difficulty: "beginner",
        topic: "Memory Management"
      },
      {
        id: "os_4",
        question: "What is the difference between a process and a thread?",
        type: "essay",
        explanation: "A process is an independent program with its own memory space, while a thread is a lightweight unit of execution that shares memory with other threads in the same process.",
        difficulty: "intermediate",
        topic: "Process Management"
      },
      {
        id: "os_5",
        question: "Which file system is commonly used in Linux?",
        type: "multiple-choice",
        options: ["NTFS", "FAT32", "ext4", "HFS+"],
        correctAnswer: 2,
        explanation: "ext4 is the most commonly used file system in Linux distributions.",
        difficulty: "beginner",
        topic: "File Systems"
      }
    ]
  },
  dbms: {
    name: "Database Management Systems",
    icon: "🗄️",
    description: "Master database design, SQL, and data management concepts",
    topics: ["SQL", "Normalization", "ACID Properties", "Indexing", "Transactions", "ER Diagrams"],
    questions: [
      {
        id: "dbms_1",
        question: "What are ACID properties in database transactions?",
        type: "essay",
        explanation: "ACID stands for Atomicity (all or nothing), Consistency (data integrity), Isolation (concurrent transactions don't interfere), and Durability (permanent changes).",
        difficulty: "intermediate",
        topic: "ACID Properties"
      },
      {
        id: "dbms_2",
        question: "What is the purpose of database normalization?",
        type: "essay",
        explanation: "Normalization reduces data redundancy and improves data integrity by organizing data into well-structured tables and eliminating anomalies.",
        difficulty: "intermediate",
        topic: "Normalization"
      },
      {
        id: "dbms_3",
        question: "Which SQL command is used to modify existing data?",
        type: "multiple-choice",
        options: ["INSERT", "UPDATE", "DELETE", "ALTER"],
        correctAnswer: 1,
        explanation: "The UPDATE command is used to modify existing data in database tables.",
        difficulty: "beginner",
        topic: "SQL"
      },
      {
        id: "dbms_4",
        question: "What is the difference between INNER JOIN and LEFT JOIN?",
        type: "essay",
        explanation: "INNER JOIN returns only matching records from both tables, while LEFT JOIN returns all records from the left table and matching records from the right table.",
        difficulty: "intermediate",
        topic: "SQL"
      },
      {
        id: "dbms_5",
        question: "What is the purpose of database indexing?",
        type: "essay",
        explanation: "Indexing improves query performance by creating data structures that allow faster data retrieval, similar to an index in a book.",
        difficulty: "beginner",
        topic: "Indexing"
      }
    ]
  },
  webdev: {
    name: "Web Development",
    icon: "🌍",
    description: "Learn modern web technologies, frameworks, and best practices",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "APIs", "Security", "Performance"],
    questions: [
      {
        id: "webdev_1",
        question: "What is the difference between localStorage and sessionStorage?",
        type: "essay",
        explanation: "localStorage persists data even after the browser is closed, while sessionStorage data is cleared when the browser session ends.",
        difficulty: "beginner",
        topic: "JavaScript"
      },
      {
        id: "webdev_2",
        question: "What is CORS and why is it important?",
        type: "essay",
        explanation: "CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access resources from your server, preventing unauthorized cross-origin requests.",
        difficulty: "intermediate",
        topic: "Security"
      },
      {
        id: "webdev_3",
        question: "What is the virtual DOM in React?",
        type: "essay",
        explanation: "The virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance by minimizing direct DOM manipulations.",
        difficulty: "intermediate",
        topic: "React"
      },
      {
        id: "webdev_4",
        question: "What is the purpose of useEffect in React?",
        type: "essay",
        explanation: "useEffect is a React Hook that allows you to perform side effects in functional components, such as data fetching, subscriptions, or manual DOM manipulations.",
        difficulty: "intermediate",
        topic: "React"
      },
      {
        id: "webdev_5",
        question: "What is the difference between GET and POST requests?",
        type: "essay",
        explanation: "GET requests are used to retrieve data and are idempotent, while POST requests are used to submit data and may change server state.",
        difficulty: "beginner",
        topic: "APIs"
      }
    ]
  }
};

export default subjects;
