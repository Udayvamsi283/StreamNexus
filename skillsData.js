// Skills data for the Skills to Learn page
const skillData = {
  programming: {
    title: "Programming Languages",
    image: "/placeholder.svg?height=200&width=500&text=Programming+Languages",
    what: "Programming languages are formal languages comprising a set of instructions that produce various kinds of output. They are used in computer programming to implement algorithms.",
    learn:
      "You will learn syntax, data types, control structures, functions, object-oriented programming concepts, and how to solve problems using code.",
    features: [
      "Versatility across different domains",
      "Foundation for all software development",
      "Logical thinking and problem-solving skills",
      "Automation of repetitive tasks",
      "Creation of applications, websites, and software systems",
    ],
    demand:
      "Programming skills are in extremely high demand across all industries. According to industry reports, there is a global shortage of qualified programmers, with demand exceeding supply by a significant margin.",
    companies:
      "Google, Microsoft, Amazon, Facebook, Apple, and virtually every tech company requires programming skills. Even non-tech companies now have significant IT departments that need programmers.",
    career:
      "Career paths include Software Developer, Web Developer, Mobile App Developer, Game Developer, DevOps Engineer, and many more specialized roles depending on the languages and technologies you master.",
  },
  dsa: {
    title: "Data Structures & Algorithms",
    image: "/placeholder.svg?height=200&width=500&text=Data+Structures+and+Algorithms",
    what: "Data Structures and Algorithms (DSA) is the study of organizing data in a way that enables efficient storage, retrieval, and modification, along with the step-by-step procedures for solving computational problems.",
    learn:
      "You will learn about arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, searching algorithms, dynamic programming, and algorithm analysis techniques.",
    features: [
      "Foundation for efficient problem-solving",
      "Optimization of code performance",
      "Critical for technical interviews",
      "Essential for handling large datasets",
      "Applicable across all programming domains",
    ],
    demand:
      "DSA skills are highly valued in the tech industry, especially for roles that require handling large amounts of data or complex computational problems. Companies specifically test these skills during technical interviews.",
    companies:
      "Google, Microsoft, Amazon, Facebook, and other tech giants are known for their rigorous DSA-based interviews. Financial institutions, research organizations, and data-heavy companies also value these skills.",
    career:
      "Strong DSA skills can lead to careers as a Software Engineer, Algorithm Specialist, Research Scientist, Data Scientist, or Technical Architect. These roles often come with higher compensation due to the specialized knowledge required.",
  },
  web: {
    title: "Web Development",
    image: "/placeholder.svg?height=200&width=500&text=Web+Development",
    what: "Web development is the process of building and maintaining websites and web applications. It encompasses everything from simple static web pages to complex web-based applications, social network services, and electronic business platforms.",
    learn:
      "You will learn HTML, CSS, JavaScript, front-end frameworks (React, Angular, Vue), back-end technologies (Node.js, Django, Ruby on Rails), databases, APIs, and deployment strategies.",
    features: [
      "Creation of interactive user interfaces",
      "Building responsive designs for all devices",
      "Server-side application logic",
      "Database integration and management",
      "API development and consumption",
    ],
    demand:
      "Web development skills are among the most in-demand in the tech industry. With businesses of all sizes needing web presence, the demand for skilled web developers continues to grow year over year.",
    companies:
      "Every tech company needs web developers, including giants like Google, Amazon, and Facebook. Additionally, digital agencies, e-commerce companies, startups, and even traditional businesses with digital presence hire web developers.",
    career:
      "Career paths include Front-end Developer, Back-end Developer, Full-stack Developer, UI/UX Developer, WordPress Developer, E-commerce Specialist, and Web Application Architect.",
  },
  database: {
    title: "Database Management",
    image: "/placeholder.svg?height=200&width=500&text=Database+Management",
    what: "Database Management involves the organization, storage, retrieval, security, and integrity of data in computer systems. It includes designing database schemas, optimizing queries, and ensuring data consistency and availability.",
    learn:
      "You will learn SQL, database design principles, normalization, indexing, transaction management, and various database systems like MySQL, PostgreSQL, MongoDB, and Redis.",
    features: [
      "Efficient data organization and retrieval",
      "Data integrity and consistency maintenance",
      "Security implementation for sensitive data",
      "Performance optimization for large datasets",
      "Integration with applications and services",
    ],
    demand:
      "Database skills are critical in today's data-driven world. With the exponential growth of data collection, companies need professionals who can efficiently manage and extract value from their data assets.",
    companies:
      "Oracle, IBM, Microsoft, Amazon Web Services, and MongoDB Inc. are directly involved in database technologies. Additionally, any company with significant data operations needs database specialists.",
    career:
      "Career paths include Database Administrator, Database Developer, Data Engineer, Data Architect, Business Intelligence Developer, and Database Security Specialist.",
  },
  os: {
    title: "Operating Systems",
    image: "/placeholder.svg?height=200&width=500&text=Operating+Systems",
    what: "Operating Systems (OS) are software that manage computer hardware and software resources and provide common services for computer programs. They act as an intermediary between users and the computer hardware.",
    learn:
      "You will learn about process management, memory management, file systems, I/O systems, virtualization, security mechanisms, and the architecture of popular operating systems like Linux, Windows, and macOS.",
    features: [
      "Resource allocation and management",
      "Process scheduling and multitasking",
      "Memory protection and virtual memory",
      "File system organization and access",
      "Security and permission systems",
    ],
    demand:
      "OS knowledge is fundamental for many IT roles, particularly in system administration, cybersecurity, and low-level software development. Linux skills are especially in demand for server environments.",
    companies:
      "Microsoft, Apple, Red Hat, Canonical (Ubuntu), and Google (Android/Chrome OS) develop operating systems. Additionally, any company with significant IT infrastructure needs OS specialists.",
    career:
      "Career paths include System Administrator, DevOps Engineer, System Programmer, Kernel Developer, Embedded Systems Engineer, and Technical Support Specialist.",
  },
  networks: {
    title: "Computer Networks",
    image: "/placeholder.svg?height=200&width=500&text=Computer+Networks",
    what: "Computer Networks is the study of how computers and other devices communicate with each other. It involves the design, implementation, and management of networks ranging from small local networks to the global Internet.",
    learn:
      "You will learn about network protocols (TCP/IP, HTTP), network devices (routers, switches), network topologies, subnetting, routing algorithms, network security, and troubleshooting techniques.",
    features: [
      "Design and implementation of network infrastructures",
      "Configuration of network devices and services",
      "Network security and threat mitigation",
      "Performance optimization and troubleshooting",
      "Cloud networking and virtualization",
    ],
    demand:
      "Networking skills remain in high demand as organizations continue to expand their digital infrastructure. With the growth of cloud computing and IoT, network expertise is increasingly valuable.",
    companies:
      "Cisco, Juniper Networks, Huawei, and other networking equipment manufacturers. Additionally, ISPs, cloud providers like AWS and Azure, and any company with complex network infrastructure.",
    career:
      "Career paths include Network Administrator, Network Engineer, Network Architect, Security Engineer, Cloud Network Engineer, and Telecommunications Specialist.",
  },
  software: {
    title: "Software Engineering",
    image: "/placeholder.svg?height=200&width=500&text=Software+Engineering",
    what: "Software Engineering is the systematic application of engineering approaches to the development of software. It goes beyond programming to include aspects like requirements analysis, design, testing, maintenance, and project management.",
    learn:
      "You will learn software development methodologies (Agile, Waterfall), design patterns, software architecture, testing strategies, version control, CI/CD pipelines, and project management techniques.",
    features: [
      "Systematic approach to software development",
      "Quality assurance and testing methodologies",
      "Project planning and management",
      "Collaborative development practices",
      "Maintenance and evolution of software systems",
    ],
    demand:
      "Software engineering skills are consistently in high demand across all sectors. As software becomes central to more industries, the need for qualified software engineers continues to grow.",
    companies:
      "All major tech companies like Google, Microsoft, Amazon, and Apple. Additionally, enterprise software companies like SAP and Oracle, and increasingly non-tech companies as they undergo digital transformation.",
    career:
      "Career paths include Software Engineer, Quality Assurance Engineer, DevOps Engineer, Technical Lead, Software Architect, and Engineering Manager.",
  },
  cloud: {
    title: "Cloud Computing",
    image: "/placeholder.svg?height=200&width=500&text=Cloud+Computing",
    what: 'Cloud Computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.',
    learn:
      "You will learn about cloud service models (IaaS, PaaS, SaaS), deployment models, virtualization, containerization, cloud security, and specific cloud platforms like AWS, Azure, and Google Cloud.",
    features: [
      "Scalable and flexible resource allocation",
      "Cost-effective infrastructure management",
      "Global deployment and high availability",
      "Automated provisioning and management",
      "Integration with modern development practices",
    ],
    demand:
      "Cloud computing skills are among the fastest-growing in demand. As organizations continue to migrate to the cloud, professionals with cloud expertise are highly sought after.",
    companies:
      "Amazon Web Services, Microsoft Azure, Google Cloud Platform, IBM Cloud, and Oracle Cloud are major cloud providers. Additionally, virtually every tech company now utilizes cloud services.",
    career:
      "Career paths include Cloud Architect, Cloud Engineer, DevOps Engineer, Site Reliability Engineer, Cloud Security Specialist, and Cloud Solutions Architect.",
  },
  ai: {
    title: "Artificial Intelligence",
    image: "/placeholder.svg?height=200&width=500&text=Artificial+Intelligence",
    what: "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, problem-solving, perception, and language understanding.",
    learn:
      "You will learn about machine learning algorithms, neural networks, deep learning, natural language processing, computer vision, reinforcement learning, and AI ethics.",
    features: [
      "Development of intelligent systems",
      "Pattern recognition and prediction",
      "Natural language understanding and generation",
      "Computer vision and image recognition",
      "Decision-making and problem-solving automation",
    ],
    demand:
      "AI skills are among the most in-demand and highest-paying in the tech industry. As AI applications expand across industries, the demand for AI specialists continues to outpace supply.",
    companies:
      "Google (DeepMind), OpenAI, Microsoft, Facebook AI Research, Amazon, IBM Watson, and numerous AI startups. Additionally, financial institutions, healthcare organizations, and manufacturing companies are investing heavily in AI.",
    career:
      "Career paths include AI Engineer, Machine Learning Engineer, Data Scientist, Research Scientist, NLP Engineer, Computer Vision Engineer, and AI Ethics Specialist.",
  },
}

// Export the data for use in other files
export default skillData

