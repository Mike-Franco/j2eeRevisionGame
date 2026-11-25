/* J2EE Quiz Arena - question bank
 * Source: ST0510 JAD lecture slides (Topics 1-4) + Practicals 1-4.
 * Types: mcq | multi | order | type | code | match
 */
window.QUESTION_BANK = {
  topics: [
    { id: "javaee",  name: "Jakarta EE & Architecture", icon: "🏛️", blurb: "Platform, containers, tiers and layers" },
    { id: "jsp",     name: "JSP Basics",                icon: "📄", blurb: "Translation, scripting elements, directives" },
    { id: "forms",   name: "Forms & Implicit Objects",  icon: "📝", blurb: "Parameters, redirects, request/response" },
    { id: "db",      name: "JDBC & Database Access",    icon: "🗄️", blurb: "7 steps, ResultSet, CRUD, SQL injection" },
    { id: "session", name: "Session Management",        icon: "🍪", blurb: "HttpSession, cookies, timeouts, security" },
    { id: "pract",   name: "Practicals & Code Traps",   icon: "🧪", blurb: "What Pract 1-4 actually ask you to build" }
  ],
  questions: [
    /* ============ TOPIC 1: JAKARTA EE & ARCHITECTURE ============ */
    {
      id: "je1", topic: "javaee", type: "mcq", difficulty: 1,
      q: "What is Jakarta EE (formerly Java EE)?",
      options: [
        "A set of enterprise Java specifications built on Java SE, with APIs for web apps and backend services",
        "A single application server product sold by the Eclipse Foundation",
        "A JavaScript framework for building single-page applications",
        "A build tool that replaces Maven and Gradle"
      ],
      answer: 0,
      explain: "Jakarta EE is a standard (a set of specifications), not one server product. Compatible runtimes implement the specs."
    },
    {
      id: "je2", topic: "javaee", type: "mcq", difficulty: 1,
      q: "Which Java SE version is the minimum baseline for Jakarta EE 11?",
      options: ["Java SE 8", "Java SE 11", "Java SE 17", "Java SE 21"],
      answer: 2,
      explain: "Jakarta EE 11 (released 2025) requires Java SE 17 or later."
    },
    {
      id: "je3", topic: "javaee", type: "multi", difficulty: 2,
      q: "Which of these are goals or benefits of Jakarta EE? (Select all that apply)",
      options: [
        "Productivity - standard APIs and dependency injection reduce infrastructure code",
        "Portability - compatible implementations support the same specification contracts",
        "Containers manage component lifecycles and provide services such as security and transactions",
        "It guarantees that every database vendor uses identical SQL syntax"
      ],
      answer: [0, 1, 2],
      explain: "SQL dialects still differ between DBMSs - JDBC gives standard connectivity, not identical SQL."
    },
    {
      id: "je4", topic: "javaee", type: "order", difficulty: 2,
      q: "Order the interaction flow of a request through the layers, from start to finish.",
      items: [
        "A browser or mobile client sends an HTTPS request",
        "A Servlet or REST endpoint validates input and invokes a business service",
        "The service checks permissions and applies business rules",
        "Persistence, Data or JDBC reads or updates storage in a transaction",
        "The service returns a result or an error to the web/API layer",
        "The application returns HTML or JSON with an appropriate HTTP status"
      ],
      explain: "Client to presentation, then business logic, then data access, then back up to the response."
    },
    {
      id: "je5", topic: "javaee", type: "mcq", difficulty: 2,
      q: "In a two-tier database application, how does the client talk to the database?",
      options: [
        "Through an application server that pools the connections",
        "Directly, using a JDBC driver to send queries and receive results",
        "Only through stored procedures invoked by a servlet",
        "Through a message queue such as JMS"
      ],
      answer: 1,
      explain: "Two-tier = client + database server. The client often holds both UI and business logic and uses JDBC directly."
    },
    {
      id: "je6", topic: "javaee", type: "mcq", difficulty: 2,
      q: "Which is a genuine trade-off of a two-tier architecture?",
      options: [
        "Every request must pass through an extra network hop to the app tier",
        "Business logic changes can require updates on many client machines",
        "It cannot use JDBC drivers at all",
        "It cannot separate code into logical layers"
      ],
      answer: 1,
      explain: "Logic lives on each client, so a change must be redeployed everywhere. Two tiers can still be organised into logical layers."
    },
    {
      id: "je7", topic: "javaee", type: "multi", difficulty: 2,
      q: "What does adding an application tier (multi-tier) give you? (Select all that apply)",
      options: [
        "Centralised business logic that simplifies updates",
        "Better control over database access",
        "Tiers that can be scaled independently",
        "No extra latency, because there are more network calls"
      ],
      answer: [0, 1, 2],
      explain: "Extra network calls ADD latency - that is the trade-off, not a benefit."
    },
    {
      id: "je8", topic: "javaee", type: "mcq", difficulty: 1,
      q: "Which layer of a Jakarta EE application accepts requests and renders HTML or JSON?",
      options: ["Presentation layer", "Business layer", "Data access layer", "Persistence layer"],
      answer: 0,
      explain: "Servlets and REST endpoints accept requests; Pages or Faces render HTML; a browser/mobile UI can consume JSON."
    },
    {
      id: "je9", topic: "javaee", type: "type", difficulty: 1,
      q: "Layers separate responsibilities. Several of them can share one deployment ____. (One word)",
      answers: ["tier", "tiers"],
      explain: "A layer is a logical split; a tier is a physical deployment unit. Several layers can run in one tier."
    },
    {
      id: "je10", topic: "javaee", type: "mcq", difficulty: 3,
      q: "In Jakarta EE 9+, enterprise API packages moved from javax.* to which namespace?",
      options: ["java.ee.*", "jakarta.*", "org.eclipse.*", "enterprise.*"],
      answer: 1,
      explain: "Jakarta EE 9 (2020) renamed enterprise APIs to jakarta.*. Java SE packages such as javax.sql kept their names - never blanket-replace every javax import."
    },
    {
      id: "je11", topic: "javaee", type: "mcq", difficulty: 2,
      q: "Which statement about javax.sql is correct?",
      options: [
        "It was renamed to jakarta.sql in Jakarta EE 9",
        "It is a Java SE package, so it keeps its javax.sql name",
        "It no longer exists in Jakarta EE 11",
        "It was replaced by jakarta.persistence"
      ],
      answer: 1,
      explain: "JDBC (java.sql / javax.sql) remains part of Java SE and was not renamed."
    },
    {
      id: "je12", topic: "javaee", type: "order", difficulty: 2,
      q: "Order the steps of a Jakarta EE specification's release process (JESP).",
      items: [
        "Specification teams propose changes and develop the API in the open",
        "Creation, plan and release reviews are held",
        "The Specification Committee holds ballots",
        "The release ships with a specification, TCK tests and a compatible implementation"
      ],
      explain: "JESP is based on the Eclipse Foundation process; each release includes spec + TCK + compatible implementation."
    },
    {
      id: "je13", topic: "javaee", type: "multi", difficulty: 2,
      q: "Which are part of the Jakarta EE 11 web APIs? (Select all that apply)",
      options: ["Servlet 6.1", "RESTful Web Services 4.0", "WebSocket 2.2", "Swing 2.0"],
      answer: [0, 1, 2],
      explain: "Swing is a Java SE desktop UI toolkit - it has nothing to do with the Jakarta EE web profile."
    },
    {
      id: "je14", topic: "javaee", type: "mcq", difficulty: 3,
      q: "An 'EE container' is being compared with an 'OS container such as Docker'. What is the difference?",
      options: [
        "They are the same thing with different names",
        "The EE container hosts web/enterprise components and manages their lifecycle; Docker isolates an OS-level process",
        "Docker can only run Jakarta EE applications",
        "The EE container is a database engine"
      ],
      answer: 1,
      explain: "A Jakarta EE container is server software that manages component lifecycles and services. It is unrelated to OS-level containers."
    },
    {
      id: "je15", topic: "javaee", type: "mcq", difficulty: 3,
      q: "Which API was newly added in Jakarta EE 11 to provide repository interfaces?",
      options: ["Persistence 3.2", "Jakarta Data 1.0", "Transactions 2.0", "Validation 3.1"],
      answer: 1,
      explain: "Persistence 3.2 maps entities; the new Data 1.0 adds repository interfaces. JDBC remains part of Java SE."
    },

    /* ============ TOPIC 2: JSP BASICS ============ */
    {
      id: "jsp1", topic: "jsp", type: "order", difficulty: 2,
      q: "Order how a JSP page runs, from first request to later requests.",
      items: [
        "Translate: the container turns JSP source into servlet code",
        "Compile: the container compiles the servlet",
        "Run: the servlet handles the request",
        "Reuse: later requests use the compiled servlet"
      ],
      explain: "Translate, compile, run, reuse. Translation may happen before deployment or on first use."
    },
    {
      id: "jsp2", topic: "jsp", type: "mcq", difficulty: 1,
      q: "What does the browser actually receive from a JSP page?",
      options: [
        "The JSP source code, which the browser compiles",
        "The generated HTML - the server runs the JSP",
        "A .class file that the browser executes",
        "Only the Java statements inside <% %>"
      ],
      answer: 1,
      explain: "The container runs the JSP on the server; the browser only ever gets the generated HTML."
    },
    {
      id: "jsp3", topic: "jsp", type: "match", difficulty: 1,
      q: "Match each JSP syntax to what it does.",
      pairs: [
        { left: "<% ... %>",  right: "Scriptlet: runs Java statements" },
        { left: "<%! ... %>", right: "Declaration: defines a field or method" },
        { left: "<%= ... %>", right: "Expression: writes a value" },
        { left: "<%@ ... %>", right: "Directive: page or include" }
      ],
      explain: "% is a statement, ! a declaration, = an expression, @ a directive. Read the opening tag carefully."
    },
    {
      id: "jsp4", topic: "jsp", type: "mcq", difficulty: 1,
      q: "Which tag runs a Java statement for each request?",
      options: ["<% ... %>", "<%! ... %>", "<%= ... %>", "<%@ ... %>"],
      answer: 0,
      explain: "A scriptlet <% %> is translated into code INSIDE _jspService(), so it runs per request."
    },
    {
      id: "jsp5", topic: "jsp", type: "code", difficulty: 2,
      q: "Complete the opening tag so the method becomes a member of the generated servlet class.",
      code: "___!\n  private boolean isOdd(int n) {\n    return n % 2 != 0;\n  }\n%>",
      answers: ["<%", "<% "],
      explain: "A declaration uses <%! ... %>. Its code becomes a member of the servlet class, not part of _jspService()."
    },
    {
      id: "jsp6", topic: "jsp", type: "code", difficulty: 1,
      q: "Complete the expression that writes the value of Math.random() into the page.",
      code: "<p>___ Math.random() %></p>",
      answers: ["<%="],
      explain: "An expression is <%= ... %>. Do NOT put a semicolon at the end of an expression."
    },
    {
      id: "jsp7", topic: "jsp", type: "mcq", difficulty: 2,
      q: "Why does a declaration <%! %> deserve extra care?",
      options: [
        "It is only allowed in the first 10 lines of a JSP",
        "It becomes a class-level field shared by every request on the single servlet instance",
        "It can only hold String values",
        "It is compiled on the client"
      ],
      answer: 1,
      explain: "Tomcat creates ONE servlet instance and serves every request with it, on many threads. Mutable fields in a declaration are shared state."
    },
    {
      id: "jsp8", topic: "jsp", type: "multi", difficulty: 2,
      q: "Which statements about an expression <%= ... %> are TRUE? (Select all that apply)",
      options: [
        "It writes the value of a Java expression into the response",
        "You must not add a semicolon at the end",
        "It automatically HTML-encodes the value",
        "It can replace out.print() when generating a multiplication table"
      ],
      answer: [0, 1, 3],
      explain: "Expressions do NOT encode HTML automatically - use h(...) / OWASP Encoder for untrusted text. Practical 3 Part 2 asks you to replace out.print with expressions."
    },
    {
      id: "jsp9", topic: "jsp", type: "mcq", difficulty: 2,
      q: "Which directive merges another file into the page during translation?",
      options: [
        "<%@ page import=\"java.time.LocalDate\" %>",
        "<%@ include file=\"header.html\" %>",
        "<jsp:include page=\"header.html\" />",
        "<c:import url=\"header.html\" />"
      ],
      answer: 1,
      explain: "The include DIRECTIVE merges a file at translation time; the two files share one translation unit. <jsp:include> happens at request time."
    },
    {
      id: "jsp10", topic: "jsp", type: "type", difficulty: 1,
      q: "What file extension signals a JSP fragment used with the include directive? (e.g. html-escape.____)",
      answers: ["jspf", ".jspf"],
      explain: ".jspf is the convention for a JSP fragment that gets included at translation time."
    },
    {
      id: "jsp11", topic: "jsp", type: "mcq", difficulty: 3,
      q: "Which encoding setting controls how the container READS the JSP source file?",
      options: ["contentType", "pageEncoding", "request.setCharacterEncoding", "response.setBufferSize"],
      answer: 1,
      explain: "pageEncoding = source file. contentType/charset = response. request.setCharacterEncoding = submitted text, and must be called before reading parameters."
    },
    {
      id: "jsp12", topic: "jsp", type: "multi", difficulty: 3,
      q: "Which are the three different encoding settings a JSP developer must not confuse? (Select all that apply)",
      options: [
        "pageEncoding - how the container reads the JSP source file",
        "contentType with charset - the response type and character encoding",
        "request.setCharacterEncoding - how the server reads submitted text",
        "cookieEncoding - how cookies are encrypted"
      ],
      answer: [0, 1, 2],
      explain: "Source file, response and request are three different things. Call request.setCharacterEncoding BEFORE reading form values."
    },
    {
      id: "jsp13", topic: "jsp", type: "mcq", difficulty: 2,
      q: "What does <%@ page contentType=\"text/html; charset=UTF-8\" %> set?",
      options: [
        "How the JSP source file is read from disk",
        "The response type and its character encoding",
        "The encoding of submitted form fields",
        "The encoding of the database connection"
      ],
      answer: 1,
      explain: "contentType with charset describes the RESPONSE. It does not set request encoding."
    },
    {
      id: "jsp14", topic: "jsp", type: "order", difficulty: 2,
      q: "Order what happens on a first request that also triggers translation.",
      items: [
        "The browser sends a request for the page",
        "The container translates the JSP into servlet code",
        "The container compiles the servlet",
        "The servlet runs and writes the generated HTML",
        "The browser displays the HTML it received"
      ],
      explain: "A database is optional - a JSP does not need one to work."
    },
    {
      id: "jsp15", topic: "jsp", type: "mcq", difficulty: 3,
      q: "What does the h(...) helper built with OWASP Encoder actually protect against?",
      options: [
        "SQL injection",
        "HTML text injection (XSS) - but it does not validate input or make JavaScript/URLs safe",
        "Weak passwords",
        "Slow database queries"
      ],
      answer: 1,
      explain: "Encode.forHtml escapes HTML text. Same root cause as SQL injection - data crossing into code - but a different sink."
    },
    {
      id: "jsp16", topic: "jsp", type: "mcq", difficulty: 2,
      q: "In Jakarta EE 9+ / Tomcat 11, which package prefix do servlet imports use?",
      options: ["javax.servlet.*", "jakarta.servlet.*", "java.servlet.*", "org.apache.servlet.*"],
      answer: 1,
      explain: "Tomcat 10+ (Jakarta EE 9+) renamed the Servlet/JSP packages from javax.* to jakarta.*. java.sql is unchanged."
    },
    {
      id: "jsp17", topic: "jsp", type: "type", difficulty: 2,
      q: "Which Java class is the implicit 'out' object an instance of? (Class name only)",
      answers: ["JspWriter", "jakarta.servlet.jsp.JspWriter", "javax.servlet.jsp.JspWriter"],
      explain: "out is a JspWriter. request is HttpServletRequest; response is HttpServletResponse."
    },
    {
      id: "jsp18", topic: "jsp", type: "mcq", difficulty: 2,
      q: "Which comment is removed during translation and never reaches the browser?",
      options: [
        "<%-- This comment stays on the server --%>",
        "<!-- HTML comment -->",
        "// Java line comment inside a scriptlet",
        "/* block comment */ inside a scriptlet"
      ],
      answer: 0,
      explain: "A JSP comment <%-- --%> is stripped during translation. HTML comments are sent to the browser."
    },
    {
      id: "jsp19", topic: "jsp", type: "code", difficulty: 2,
      q: "Complete the page directive that sets the response type and encoding.",
      code: '<%@ page _________="text/html; charset=UTF-8" %>',
      answers: ["contentType"],
      explain: "contentType sets the response type and character encoding. pageEncoding sets how the source file is read."
    },
    {
      id: "jsp20", topic: "jsp", type: "mcq", difficulty: 1,
      q: "In a JSP, what is the container?",
      options: [
        "The browser that renders the page",
        "Software on the server that manages and runs the JSP",
        "The database server",
        "A CSS framework"
      ],
      answer: 1,
      explain: "The container (e.g. Tomcat) translates, compiles and runs the JSP, and provides the implicit objects."
    },

    /* ============ TOPIC 3: FORMS & IMPLICIT OBJECTS ============ */
    {
      id: "fo1", topic: "forms", type: "mcq", difficulty: 1,
      q: "Which method reads ONE submitted value?",
      options: [
        "request.getParameter(\"text1\")",
        "request.getParameterValues(\"text1\")",
        "request.getAttribute(\"text1\")",
        "session.getParameter(\"text1\")"
      ],
      answer: 0,
      explain: "getParameter returns one String (or null). getParameterValues returns a String[] (or null)."
    },
    {
      id: "fo2", topic: "forms", type: "mcq", difficulty: 2,
      q: "A form has three checkboxes all named checkbox1. The user ticks two. What does request.getParameter(\"checkbox1\") return?",
      options: [
        "Both values joined with a comma",
        "Only the FIRST selected value",
        "null, because more than one value was sent",
        "A String[] of two elements"
      ],
      answer: 1,
      explain: "getParameter returns only the first value. Use getParameterValues to read every selected value."
    },
    {
      id: "fo3", topic: "forms", type: "code", difficulty: 2,
      q: "Complete the call that reads EVERY selected checkbox1 value.",
      code: "String[] values = request.________(\"checkbox1\");",
      answers: ["getParameterValues"],
      explain: "getParameterValues(name) returns a String[] or null. The same array-and-loop pattern works for a multiple select."
    },
    {
      id: "fo4", topic: "forms", type: "multi", difficulty: 2,
      q: "What must a JSP do when reading a multi-value parameter? (Select all that apply)",
      options: [
        "Check that the array is not null before looping",
        "Loop over the array with a for-each or an index",
        "Assume the array always has at least one element",
        "Handle the case where nothing was selected"
      ],
      answer: [0, 1, 3],
      explain: "If nothing is selected the array is null - a for-each on null throws NullPointerException. Practical 3 Part 1 wants 'You have no modules this semester'."
    },
    {
      id: "fo5", topic: "forms", type: "mcq", difficulty: 1,
      q: "Which implicit object reads submitted form values?",
      options: ["out", "request", "response", "config"],
      answer: 1,
      explain: "request (HttpServletRequest) reads parameters and attributes; out (JspWriter) writes the response."
    },
    {
      id: "fo6", topic: "forms", type: "match", difficulty: 2,
      q: "Match each implicit object to its Java type.",
      pairs: [
        { left: "request",     right: "HttpServletRequest" },
        { left: "response",    right: "HttpServletResponse" },
        { left: "session",     right: "HttpSession" },
        { left: "application", right: "ServletContext" },
        { left: "config",      right: "ServletConfig" },
        { left: "pageContext", right: "PageContext" }
      ],
      explain: "The container provides these names automatically. exception only exists on a page with isErrorPage=\"true\"."
    },
    {
      id: "fo7", topic: "forms", type: "order", difficulty: 2,
      q: "Order the scopes that pageContext.findAttribute() searches.",
      items: ["page", "request", "session", "application"],
      explain: "findAttribute searches page, request, session, application, and returns the first match."
    },
    {
      id: "fo8", topic: "forms", type: "mcq", difficulty: 2,
      q: "Which statement about response.sendRedirect() is correct?",
      options: [
        "It forwards on the server and keeps the address bar unchanged",
        "It tells the browser to make a NEW request, so the address bar changes and request attributes are lost",
        "It automatically adds the context path for you",
        "It must be called after the response is committed"
      ],
      answer: 1,
      explain: "A redirect is a new request. A forward (RequestDispatcher) stays in the same request. Call a redirect BEFORE the response is committed, and follow it with return;."
    },
    {
      id: "fo9", topic: "forms", type: "multi", difficulty: 3,
      q: "Practical 2 Part 3: the login fails. Which steps make the 'invalid ID/Password' message work? (Select all that apply)",
      options: [
        "verifyUser.jsp calls response.sendRedirect(\"login.jsp?errCode=invalidLogin\")",
        "login.jsp reads errCode with request.getParameter and checks for \"invalidLogin\"",
        "login.jsp must be a different, newly created page",
        "login.jsp must also handle errCode being null"
      ],
      answer: [0, 1, 3],
      explain: "The practical insists you reuse the ORIGINAL login.jsp - do not create a different login page."
    },
    {
      id: "fo10", topic: "forms", type: "mcq", difficulty: 2,
      q: "Why do you write return; straight after a sendRedirect()?",
      options: [
        "It is required by the compiler in a JSP",
        "To stop the rest of the page from running and writing to a committed response",
        "It closes the database connection",
        "It sets the HTTP status code"
      ],
      answer: 1,
      explain: "Once the redirect commits the response, anything written after it is discarded. return; stops the page there."
    },
    {
      id: "fo11", topic: "forms", type: "mcq", difficulty: 2,
      q: "What is the difference between request.getParameter() and request.setAttribute()?",
      options: [
        "A parameter comes FROM the browser; an attribute is data YOU attach on the server for this request",
        "An attribute comes from the browser; a parameter is set by the developer",
        "They are the same thing",
        "Only attributes can be read in a forwarded JSP"
      ],
      answer: 0,
      explain: "Parameters are submitted data. Attributes are server-side values attached to request/session/application and can be read by a forwarded page."
    },
    {
      id: "fo12", topic: "forms", type: "code", difficulty: 2,
      q: "Practical 2: which method gets the submitted login id into a String?",
      code: "String loginid = request.______(\"loginid\");",
      answers: ["getParameter"],
      explain: "request.getParameter(\"loginid\") - store it in a variable for maintainability (the practical awards marks for that)."
    },
    {
      id: "fo13", topic: "forms", type: "mcq", difficulty: 3,
      q: "A radio group submits nothing when no button is selected. What must the JSP do?",
      options: [
        "Assume a default value of \"circle\"",
        "Check for null and show a 'No selection' message",
        "Throw an exception so the user notices",
        "Re-run the form with JavaScript"
      ],
      answer: 1,
      explain: "No selection may submit no parameter at all, so getParameter returns null. Handle it explicitly."
    },
    {
      id: "fo14", topic: "forms", type: "multi", difficulty: 2,
      q: "Which controls can submit MULTIPLE values under one name? (Select all that apply)",
      options: [
        "Checkboxes that share a name",
        "A select element with the multiple attribute",
        "A single text input",
        "A group of radio buttons"
      ],
      answer: [0, 1],
      explain: "Checkboxes sharing a name and a multiple select send several values - read them with getParameterValues. Radio buttons send at most one."
    },
    {
      id: "fo15", topic: "forms", type: "type", difficulty: 2,
      q: "Which implicit object writes output to the response (used instead of System.out)?",
      answers: ["out"],
      explain: "out.println() writes to the web page; System.out.println() only prints to the Tomcat console."
    },
    {
      id: "fo16", topic: "forms", type: "mcq", difficulty: 3,
      q: "In a JSP, what is available only on a page declared with isErrorPage=\"true\"?",
      options: ["request", "session", "exception", "pageContext"],
      answer: 2,
      explain: "exception (a Throwable) exists only on an error page. Show a generic message - never stack traces or secrets."
    },
    {
      id: "fo17", topic: "forms", type: "mcq", difficulty: 2,
      q: "Which is TRUE about application (ServletContext)?",
      options: [
        "It holds attributes for a single request only",
        "It shares attributes across requests AND sessions, so shared mutable data must be protected",
        "It is the same object as session",
        "It can only store Strings"
      ],
      answer: 1,
      explain: "application lives for the whole web app. getContextPath() gives the context path; getRealPath(...) may return null in an archived deployment."
    },
    {
      id: "fo18", topic: "forms", type: "order", difficulty: 2,
      q: "Practical 2 Part 3: order the correct logic of verifyUser.jsp for a login attempt.",
      items: [
        "Read loginid and password with request.getParameter",
        "Check whether either value is missing or empty",
        "Compare the credentials with the expected values",
        "Redirect to the success page, or back to login.jsp with an error code"
      ],
      explain: "Prove existence, then validate, then process, then redirect. Never show the password back on the page."
    },
    {
      id: "fo19", topic: "forms", type: "type", difficulty: 2,
      q: "Which method changes how the server reads submitted text, and must be called BEFORE reading parameters? request.__________________(\"UTF-8\")",
      answers: ["setCharacterEncoding"],
      explain: "request.setCharacterEncoding(\"UTF-8\") must run before getParameter, or the submitted text is decoded with the wrong charset."
    },
    {
      id: "fo20", topic: "forms", type: "mcq", difficulty: 2,
      q: "A form posts to a servlet. Tomcat receives it but nothing happens. What is the usual cause?",
      options: [
        "doGet is empty and doPost was never implemented",
        "The servlet class is private",
        "The JSP is missing a semicolon",
        "The browser sent too many headers"
      ],
      answer: 0,
      explain: "A GET goes to doGet; a POST form goes to doPost. If doPost does nothing, nothing happens - pass the request on to doGet."
    },

    /* ============ TOPIC 4: JDBC & DATABASE ACCESS ============ */
    {
      id: "db1", topic: "db", type: "order", difficulty: 1,
      q: "Order the 7 steps to querying a database with JDBC.",
      items: [
        "Load the JDBC driver (optional in JDBC 4.0+)",
        "Define the connection URL",
        "Establish the connection",
        "Create a Statement object",
        "Execute a query or update",
        "Process the results",
        "Close the connection"
      ],
      explain: "Class.forName, connURL, DriverManager.getConnection, createStatement, executeQuery/executeUpdate, rs.next()/getX, close."
    },
    {
      id: "db2", topic: "db", type: "code", difficulty: 1,
      q: "Complete Step 3 - establish the connection using the URL, user and password.",
      code: "Connection conn = DriverManager.___________(connURL, \"dbuser\", \"dbpwd\");",
      answers: ["getConnection"],
      explain: "DriverManager.getConnection(url, user, pwd). SQLException handling is required."
    },
    {
      id: "db3", topic: "db", type: "mcq", difficulty: 2,
      q: "Which method executes a SELECT and returns a ResultSet?",
      options: ["executeUpdate(sql)", "executeQuery(sql)", "execute(sql)", "runQuery(sql)"],
      answer: 1,
      explain: "executeQuery returns a ResultSet (SELECT). executeUpdate returns int rows affected (INSERT/UPDATE/DELETE/DDL)."
    },
    {
      id: "db4", topic: "db", type: "mcq", difficulty: 2,
      q: "What does executeUpdate() return?",
      options: [
        "A ResultSet of the affected rows",
        "The number of rows affected, which can be zero",
        "A boolean: true if it worked",
        "The generated primary key only"
      ],
      answer: 1,
      explain: "It returns an int row count. Zero is possible - check it before saying 'inserted'."
    },
    {
      id: "db5", topic: "db", type: "multi", difficulty: 2,
      q: "Which commands are run with executeUpdate()? (Select all that apply)",
      options: ["INSERT", "UPDATE", "DELETE", "SELECT"],
      answer: [0, 1, 2],
      explain: "INSERT, UPDATE, DELETE and DDL (e.g. CREATE TABLE) use executeUpdate. SELECT uses executeQuery."
    },
    {
      id: "db6", topic: "db", type: "mcq", difficulty: 2,
      q: "When a ResultSet is first obtained, where is the cursor?",
      options: [
        "On row 1",
        "Just before the first row, so you must call next() first",
        "After the last row",
        "It does not exist until you call getString()"
      ],
      answer: 1,
      explain: "The cursor starts before row 1. next() moves to the first row and returns false at the end."
    },
    {
      id: "db7", topic: "db", type: "mcq", difficulty: 2,
      q: "Which is TRUE about a default ResultSet?",
      options: [
        "It is scrollable both ways and updatable",
        "It is forward-only and read-only, so only next() moves the cursor",
        "It is always null when the query matches nothing",
        "Its column indexes start at 0"
      ],
      answer: 1,
      explain: "Default is forward-only, read-only. previous()/last() need a scrollable ResultSet. It may be empty but never null, and indexes start at 1."
    },
    {
      id: "db8", topic: "db", type: "code", difficulty: 1,
      q: "Complete the loop that walks every row of the ResultSet.",
      code: "while (rs.______()) {\n  int id = rs.getInt(\"id\");\n}",
      answers: ["next"],
      explain: "rs.next() returns true while there is another row."
    },
    {
      id: "db9", topic: "db", type: "mcq", difficulty: 1,
      q: "Column \"score\" is an INT. Which call reads it correctly?",
      options: ["rs.getString(\"score\")", "rs.getInt(\"score\")", "rs.getInteger(\"score\")", "rs.getValue(\"score\")"],
      answer: 1,
      explain: "Match the getter to the column type: getInt, getLong, getString, and getObject(\"col\", LocalDate.class) for DATE/TIMESTAMP."
    },
    {
      id: "db10", topic: "db", type: "mcq", difficulty: 2,
      q: "Which single line deletes EVERY row of a table?",
      options: [
        "DELETE FROM SALESTABLE;",
        "DELETE SALESTABLE;",
        "REMOVE FROM SALESTABLE;",
        "DROP SALESTABLE;"
      ],
      answer: 0,
      explain: "DELETE FROM <table> without WHERE removes every row. UPDATE without WHERE changes every row too. DROP deletes the whole table."
    },
    {
      id: "db11", topic: "db", type: "type", difficulty: 2,
      q: "Which SQL keyword must appear in an UPDATE so that only matching rows change?",
      answers: ["WHERE", "where"],
      explain: "UPDATE ... SET ... WHERE <condition>. Without WHERE, every row changes."
    },
    {
      id: "db12", topic: "db", type: "mcq", difficulty: 2,
      q: "Why is a PreparedStatement the primary defence against SQL injection?",
      options: [
        "It encrypts the SQL text",
        "Parameter values are sent separately from the SQL text, so input is treated as data and never as code",
        "It blocks all special characters from the request",
        "It runs the query on the client first"
      ],
      answer: 1,
      explain: "Parameters are bound with setString/setInt etc. - the SQL structure is fixed before the values arrive."
    },
    {
      id: "db13", topic: "db", type: "code", difficulty: 2,
      q: "Complete the placeholders used in a parameterised query.",
      code: "String sql = \"INSERT INTO Inventory (ITEM, QTY) VALUES (__, __)\";",
      answers: ["?", "? ?", "?,?", "?, ?"],
      explain: "Each parameter is a ? placeholder; values are bound with pstmt.setString(1, ...), pstmt.setInt(2, ...)."
    },
    {
      id: "db14", topic: "db", type: "mcq", difficulty: 2,
      q: "In a PreparedStatement, what index does the first parameter use?",
      options: ["0", "1", "-1", "The column name"],
      answer: 1,
      explain: "Parameter indexes start at 1, exactly like ResultSet column indexes."
    },
    {
      id: "db15", topic: "db", type: "multi", difficulty: 2,
      q: "Which statements about try-with-resources in JDBC are TRUE? (Select all that apply)",
      options: [
        "It closes Connection, Statement and ResultSet automatically",
        "It still closes them when an exception occurs",
        "It requires Java 7 or later",
        "It removes the need for a JDBC driver"
      ],
      answer: [0, 1, 2],
      explain: "try-with-resources (JDBC 4.1) guarantees closing. You still need the driver jar on the classpath (WEB-INF/lib)."
    },
    {
      id: "db16", topic: "db", type: "mcq", difficulty: 2,
      q: "Where does the MySQL Connector/J jar go in an Eclipse Dynamic Web Project?",
      options: [
        "In the WebContent root",
        "In src/main/webapp/WEB-INF/lib",
        "In the JRE's lib folder",
        "It is not needed - Tomcat ships with it"
      ],
      answer: 1,
      explain: "Unzip and copy mysql-connector-j-<version>.jar to src/main/webapp/WEB-INF/lib (pre-8.0.31 it was mysql-connector-java-x.y.z.jar)."
    },
    {
      id: "db17", topic: "db", type: "mcq", difficulty: 3,
      q: "Which driver class name is used by Connector/J 8.0+?",
      options: ["com.mysql.jdbc.Driver", "com.mysql.cj.jdbc.Driver", "org.mysql.Driver", "jdbc.mysql.Driver"],
      answer: 1,
      explain: "com.mysql.cj.jdbc.Driver. The old com.mysql.jdbc.Driver is deprecated in Connector/J 8+. Since JDBC 4.0 Class.forName is optional."
    },
    {
      id: "db18", topic: "db", type: "type", difficulty: 1,
      q: "Complete the MySQL connection URL for schema jspg on localhost port 3306: jdbc:mysql://localhost:3306/____",
      answers: ["jspg"],
      explain: "URL format: jdbc:mysql://host:port/schema."
    },
    {
      id: "db19", topic: "db", type: "mcq", difficulty: 2,
      q: "Why did the JDBC-ODBC bridge matter to this module?",
      options: [
        "It is the recommended way to reach MySQL today",
        "It was removed in Java 8, so current JDKs must use the vendor's pure-Java driver (no DSN needed)",
        "It is required for Maven builds",
        "It replaced PreparedStatement"
      ],
      answer: 1,
      explain: "The JDBC-ODBC bridge (used for MS Access) was removed in Java 8. A DSN is only needed for Windows ODBC access."
    },
    {
      id: "db20", topic: "db", type: "mcq", difficulty: 3,
      q: "Which class calls a stored procedure from Java?",
      options: ["PreparedStatement", "CallableStatement", "Statement", "DriverManager"],
      answer: 1,
      explain: "CallableStatement with conn.prepareCall(\"{ call testing(?) }\"). Stored procedures take IN, OUT and INOUT parameters."
    },
    {
      id: "db21", topic: "db", type: "code", difficulty: 2,
      q: "Complete the call that prepares a stored procedure call.",
      code: "CallableStatement cs = conn.__________(\"{ call testing(?) }\");",
      answers: ["prepareCall"],
      explain: "conn.prepareCall(sql) returns a CallableStatement; then cs.setString(1, name) and cs.executeQuery()."
    },
    {
      id: "db22", topic: "db", type: "mcq", difficulty: 2,
      q: "A JSP runs a SELECT and wants to show results on the page. Which is correct?",
      options: [
        "System.out.println(name) - it prints to the page",
        "out.println(name) - the implicit out object writes to the response",
        "response.println(name)",
        "request.println(name)"
      ],
      answer: 1,
      explain: "In JSP, out.println() writes to the web page; System.out.println() only prints to the Tomcat console."
    },
    {
      id: "db23", topic: "db", type: "multi", difficulty: 3,
      q: "Which practices make JSP database code safer? (Select all that apply)",
      options: [
        "Use PreparedStatement instead of concatenating user input",
        "Use a least-privilege database user, not root",
        "Never hard-code real passwords in the page",
        "Print the full SQLException stack trace to the browser so users can debug"
      ],
      answer: [0, 1, 2],
      explain: "Exception messages describe your database to whoever is looking at the screen - log them, show a plain message."
    },
    {
      id: "db24", topic: "db", type: "order", difficulty: 3,
      q: "Practical 4 Part 4: order the page flow for editing a member record.",
      items: [
        "listMembers.jsp shows all members with Edit buttons carrying the member id",
        "editMemberForm.jsp reads the id and loads that member into a form",
        "The user changes the fields and submits",
        "updateMemberForm.jsp runs an SQL UPDATE with executeUpdate()",
        "The user is sent back to listMembers.jsp with fresh data"
      ],
      explain: "The id travels by query string or hidden field; the update uses executeUpdate, not executeQuery."
    },
    {
      id: "db25", topic: "db", type: "mcq", difficulty: 3,
      q: "Which SQL statement adds a new row to member with name 'u2000' and password 'p2000', letting the database assign the id?",
      options: [
        "INSERT INTO member VALUES ('u2000','p2000')",
        "INSERT INTO member(name, password) VALUES ('u2000','p2000')",
        "ADD INTO member (name, password) ('u2000','p2000')",
        "UPDATE member SET name='u2000', password='p2000'"
      ],
      answer: 1,
      explain: "List only the columns you supply. Text values need single quotes; do not supply an auto-increment id."
    },
    {
      id: "db26", topic: "db", type: "mcq", difficulty: 2,
      q: "Which method closes the resources even when an exception is thrown inside the block?",
      options: [
        "A try/catch with conn.close() as the last statement of the try",
        "try-with-resources, declaring the resources in the try(...) parentheses",
        "Calling System.gc()",
        "Setting conn to null"
      ],
      answer: 1,
      explain: "If an exception happens mid-try, later statements are skipped. try-with-resources always closes."
    },
    {
      id: "db27", topic: "db", type: "type", difficulty: 2,
      q: "Which JDBC package must be imported to use Connection, Statement and ResultSet? (e.g. java.____.*)",
      answers: ["sql"],
      explain: "<%@ page import=\"java.sql.*\" %> - java.sql is part of Java SE and keeps its name in Jakarta EE."
    },

    /* ============ TOPIC 5: SESSION MANAGEMENT ============ */
    {
      id: "se1", topic: "session", type: "mcq", difficulty: 1,
      q: "Why is session management needed at all?",
      options: [
        "HTTP is a stateless protocol - every request is independent of the previous one",
        "Because JSP cannot store variables",
        "Because cookies are illegal in most countries",
        "Because the database is too slow to remember anything"
      ],
      answer: 0,
      explain: "Session management identifies a user and keeps their data across stateless requests. The session ID acts as a temporary credential."
    },
    {
      id: "se2", topic: "session", type: "mcq", difficulty: 1,
      q: "Which is the session object used in JSP and servlets?",
      options: ["HttpSession", "HttpServletRequest", "ServletContext", "Cookie"],
      answer: 0,
      explain: "HttpSession is an implicit JSP object (jakarta.servlet.http.HttpSession)."
    },
    {
      id: "se3", topic: "session", type: "code", difficulty: 2,
      q: "Complete the call that stores a value in the session.",
      code: "session.____________(\"favColor\", colorStr);",
      answers: ["setAttribute"],
      explain: "session.setAttribute(name, object). Read it back with session.getAttribute(\"favColor\") and a cast, or with EL ${sessionScope.favColor}."
    },
    {
      id: "se4", topic: "session", type: "mcq", difficulty: 2,
      q: "What does session.getAttribute() return when the name is not bound?",
      options: ["An empty String", "null", "An exception is thrown", "0"],
      answer: 1,
      explain: "getAttribute returns null if there is no such binding - check for null before casting."
    },
    {
      id: "se5", topic: "session", type: "mcq", difficulty: 2,
      q: "Which method ends a session and removes all objects bound to it?",
      options: ["session.close()", "session.invalidate()", "session.remove()", "session.destroy()"],
      answer: 1,
      explain: "invalidate() is used at logout. getId() returns the session id, isNew() tells you if the client does not know it yet."
    },
    {
      id: "se6", topic: "session", type: "multi", difficulty: 2,
      q: "Which are commonly used HttpSession methods? (Select all that apply)",
      options: ["setAttribute()", "getAttribute()", "invalidate()", "getId()"],
      answer: [0, 1, 2, 3],
      explain: "All four are core methods. Objects bound into a session should be Serializable if the session may be distributed."
    },
    {
      id: "se7", topic: "session", type: "mcq", difficulty: 2,
      q: "What is the difference between request.getSession(true) and request.getSession(false)?",
      options: [
        "true creates a session if none exists; false returns null instead of creating one",
        "true returns a new session always; false returns the old one",
        "false disables cookies",
        "They are identical"
      ],
      answer: 0,
      explain: "Use getSession(false) when you only need to read. getSession(true) creates a session even if you never use it."
    },
    {
      id: "se8", topic: "session", type: "mcq", difficulty: 2,
      q: "In web.xml, <session-timeout>30</session-timeout> means what?",
      options: [
        "30 seconds of total session life",
        "30 minutes of inactivity, after which the container invalidates the session",
        "30 requests per session",
        "30 sessions per user"
      ],
      answer: 1,
      explain: "web.xml values are in MINUTES and apply to all sessions. Tomcat's default is 30."
    },
    {
      id: "se9", topic: "session", type: "mcq", difficulty: 2,
      q: "session.setMaxInactiveInterval(15 * 60) sets the timeout to...",
      options: ["15 seconds", "15 minutes", "15 hours", "15 days"],
      answer: 1,
      explain: "The programmatic value is in SECONDS: 15 * 60 = 900 seconds = 15 minutes, for that session only."
    },
    {
      id: "se10", topic: "session", type: "code", difficulty: 2,
      q: "Complete the call that sets an individual session's idle timeout to 15 minutes.",
      code: "session.setMaxInactiveInterval(15 * ____);",
      answers: ["60"],
      explain: "Seconds, not minutes: 15 * 60 = 900 seconds."
    },
    {
      id: "se11", topic: "session", type: "mcq", difficulty: 2,
      q: "What is the default name of the container's session cookie?",
      options: ["SESSIONID", "JSESSIONID", "PHPSESSID", "HTTP_SESSION"],
      answer: 1,
      explain: "JSESSIONID by default, with URL rewriting as fallback when cookies are disabled."
    },
    {
      id: "se12", topic: "session", type: "match", difficulty: 2,
      q: "Match each cookie security attribute to what it does.",
      pairs: [
        { left: "HttpOnly", right: "Hides the cookie from JavaScript, limiting theft through XSS" },
        { left: "Secure",    right: "Sends the cookie over HTTPS only" },
        { left: "SameSite",  right: "Limits cross-site sending of the cookie to reduce CSRF" },
        { left: "Max-Age",   right: "Expiry time; without it the cookie lasts only until the browser closes" }
      ],
      explain: "Set SameSite explicitly: Lax suits most apps; None also needs Secure."
    },
    {
      id: "se13", topic: "session", type: "multi", difficulty: 3,
      q: "Which are session security best practices? (Select all that apply)",
      options: [
        "Call request.changeSessionId() after login to prevent session fixation",
        "Protect the cookie with HttpOnly, Secure and SameSite, over HTTPS",
        "Keep session IDs out of URLs and avoid URL rewriting",
        "Store the user's password in the session so you can re-check it"
      ],
      answer: [0, 1, 2],
      explain: "Never keep passwords or card numbers in the session. Also set an idle timeout and invalidate() at logout."
    },
    {
      id: "se14", topic: "session", type: "mcq", difficulty: 2,
      q: "Which method prevents session fixation after a successful login?",
      options: ["session.invalidate()", "request.changeSessionId()", "session.getId()", "session.setMaxInactiveInterval()"],
      answer: 1,
      explain: "changeSessionId() gives the user a new ID after login, so a pre-set (fixated) ID becomes useless."
    },
    {
      id: "se15", topic: "session", type: "mcq", difficulty: 3,
      q: "Why is URL rewriting discouraged today?",
      options: [
        "It is slower than cookies",
        "The session ID leaks through browser history, server logs and the Referer header",
        "It cannot work in Tomcat",
        "It requires a database"
      ],
      answer: 1,
      explain: "Session IDs in URLs leak everywhere. Restrict tracking with <tracking-mode>COOKIE</tracking-mode>."
    },
    {
      id: "se16", topic: "session", type: "mcq", difficulty: 2,
      q: "Which methods encode a URL for URL rewriting?",
      options: [
        "response.encodeURL() and response.encodeRedirectURL()",
        "request.encodeURL() and session.encodeURL()",
        "out.encode() and pageContext.encode()",
        "URL.encode() only"
      ],
      answer: 0,
      explain: "response.encodeURL(url) for links, response.encodeRedirectURL(url) for redirects. In JSP, <c:url> encodes for you."
    },
    {
      id: "se17", topic: "session", type: "mcq", difficulty: 2,
      q: "Which is NOT a recommended session-management technique?",
      options: ["HttpSession", "Cookies with HttpOnly/Secure/SameSite", "Hidden form fields holding the session id on every page", "Token-based sessions for stateless REST APIs"],
      answer: 2,
      explain: "Hidden form fields are massive and tedious, and users can view and edit them."
    },
    {
      id: "se18", topic: "session", type: "mcq", difficulty: 2,
      q: "Why keep temporary per-user data in the session rather than the database?",
      options: [
        "Databases cannot store strings",
        "Session data is temporary but convenient, and putting it in the database unnecessarily overloads the database server",
        "The session is encrypted automatically",
        "Session data survives a server restart"
      ],
      answer: 1,
      explain: "Shopping carts, login status and preferences belong in server-side session memory (or a shared cache such as Redis when scaled out)."
    },
    {
      id: "se19", topic: "session", type: "multi", difficulty: 3,
      q: "When you scale out to several servers, which approaches keep sessions working? (Select all that apply)",
      options: ["Sticky sessions", "Session replication", "A shared store such as Redis", "Storing the session in a static field of a servlet"],
      answer: [0, 1, 2],
      explain: "Static fields are shared in one JVM only - not across servers. Keep session attributes Serializable either way."
    },
    {
      id: "se20", topic: "session", type: "order", difficulty: 2,
      q: "Order what happens when a browser with a valid JSESSIONID cookie sends its next request.",
      items: [
        "The browser sends the Cookie request header with the session ID",
        "The container finds the matching HttpSession",
        "The JSP reads attributes with session.getAttribute() or sessionScope",
        "The page is generated with the user's stored data"
      ],
      explain: "The container sets the cookie in a Set-Cookie response header; the browser returns it in the Cookie header."
    },
    {
      id: "se21", topic: "session", type: "type", difficulty: 2,
      q: "In EL, which scope object reads a session attribute directly? (e.g. ${______.favColor})",
      answers: ["sessionScope", "sessionScope.favColor"],
      explain: "sessionScope.favColor reads the session attribute without a scriptlet."
    },
    {
      id: "se22", topic: "session", type: "code", difficulty: 3,
      q: "Complete the line that sends the user to displayinmyjsp1.jsp after storing the colour.",
      code: "session.setAttribute(\"favColor\", colorStr);\nresponse.sendRedirect(\"__________________\");",
      answers: ["displayinmyjsp1.jsp"],
      explain: "Store in the session, then redirect. The redirect is a new request, but the session survives it."
    },
    {
      id: "se23", topic: "session", type: "mcq", difficulty: 2,
      q: "A cookie is created with new Cookie(name, value). Which header sends it to the browser?",
      options: ["Cookie", "Set-Cookie", "Session-ID", "Location"],
      answer: 1,
      explain: "response.addCookie(c) writes a Set-Cookie response header. The browser then returns it in the Cookie request header."
    },
    {
      id: "se24", topic: "session", type: "mcq", difficulty: 3,
      q: "request.getCookies() returned null. What does that mean?",
      options: [
        "The browser sent no cookies with this request",
        "The session has expired",
        "The server is misconfigured",
        "The cookies were encrypted"
      ],
      answer: 0,
      explain: "getCookies() returns null when no cookies were sent - always guard the loop with a null check."
    },

    /* ============ TOPIC 6: PRACTICALS & CODE TRAPS ============ */
    {
      id: "pr1", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 1: which server does the practical tell you to set up in Eclipse?",
      options: ["Apache TomEE (TomEE PLUS)", "WildFly", "GlassFish", "JBoss EAP"],
      answer: 0,
      explain: "Download the latest Apache TomEE (TomEE PLUS) and register it as a server in Eclipse."
    },
    {
      id: "pr2", topic: "pract", type: "order", difficulty: 2,
      q: "Practical 2 Part 1-2: order the steps for the login form exercise.",
      items: [
        "Create a pract2 folder inside WebContent",
        "Create an HTML page with a FORM posting to verifyUser.jsp",
        "Add loginid and password inputs plus a submit button",
        "In verifyUser.jsp, read the parameters with request.getParameter",
        "Store the values in variables and display them"
      ],
      explain: "Storing values in variables earns marks - the practical rewards good practice."
    },
    {
      id: "pr3", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 2 Part 3: which credentials display 'Welcome, Lincoln'?",
      options: ["User ID: lincoln / Password: abc123", "User ID: Lincoln / Password: abc123", "User ID: Lincoln / Password: 123abc", "User ID: admin / Password: abc123"],
      answer: 1,
      explain: "User ID Lincoln, password abc123. Case matters - use .equals(), never ==, to compare text."
    },
    {
      id: "pr4", topic: "pract", type: "mcq", difficulty: 3,
      q: "Practical 2 Part 4: which loop prints the multiplication table for 5 from 1 to 5?",
      options: [
        "for (int i = 1; i <= 5; i++) { out.println(i + \" x 5 = \" + (i * 5)); }",
        "for (int i = 0; i <= 5; i++) { out.println(i + \" x 5 = \" + i * 5); }",
        "while (i < 5) { out.println(i * 5); }",
        "for (int i = 5; i > 0; i--) { out.println(i); }"
      ],
      answer: 0,
      explain: "Start at 1, run while i <= 5, print both the row label and the product."
    },
    {
      id: "pr5", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 3 Part 1: if the user submits the module form with no checkboxes ticked, checkModules.jsp must respond with...",
      options: [
        "An empty page",
        "A NullPointerException page",
        "\"You have no modules this semester\"",
        "A redirect back to the form"
      ],
      answer: 2,
      explain: "getParameterValues returns null when nothing is selected - handle that case explicitly."
    },
    {
      id: "pr6", topic: "pract", type: "multi", difficulty: 3,
      q: "Practical 3 Part 2 asks you to rework the multiplication table. What must the new version do? (Select all that apply)",
      options: [
        "Use only JSP Expression tags <%= %> instead of out.print for the table",
        "Allow the user to control the number of rows displayed",
        "Display both printing methods side by side",
        "Move the table into a servlet"
      ],
      answer: [0, 1, 2],
      explain: "Hint: print tables within tables to get them side by side."
    },
    {
      id: "pr7", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 3 Part 4: which directive includes header.html and footer.html so every page stays consistent?",
      options: [
        "<%@ include file=\"header.html\" %>",
        "<%@ import file=\"header.html\" %>",
        "<%@ page include=\"header.html\" %>",
        "<%@ taglib file=\"header.html\" %>"
      ],
      answer: 0,
      explain: "The include directive merges the file during translation - ideal for a shared header and footer."
    },
    {
      id: "pr8", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 3 Part 5: displayDate.jsp formats the date with which class?",
      options: ["java.time.LocalDate", "java.text.SimpleDateFormat", "java.util.Calendar", "java.sql.Date"],
      answer: 1,
      explain: "SimpleDateFormat formats a java.util.Date with a pattern such as dd/MM/yyyy HH:mm:ss. Import it with the page directive."
    },
    {
      id: "pr9", topic: "pract", type: "code", difficulty: 2,
      q: "Practical 3 Part 5: complete the end of the page directive.",
      code: "<%@ page import=\"java.text.SimpleDateFormat\" __ %>",
      answers: ["%"],
      explain: "Directives close with %>. The page directive's import attribute brings classes from other packages into the JSP."
    },
    {
      id: "pr10", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 4 Part 1: which JSP lists all records of the member table?",
      options: ["testDbAccess.jsp", "checkModules.jsp", "displayMTable.jsp", "verifyUser.jsp"],
      answer: 0,
      explain: "testDbAccess.jsp runs the seven JDBC steps and prints every member. In Part 3 it becomes listMembers.jsp with an HTML table."
    },
    {
      id: "pr11", topic: "pract", type: "mcq", difficulty: 3,
      q: "Practical 4 Part 3: how does listMembers.jsp build the table rows?",
      options: [
        "It runs one query per column",
        "It writes <tr> and <td> tags inside the while (rs.next()) loop",
        "It uses <c:forEach> only",
        "It lets the database return HTML"
      ],
      answer: 1,
      explain: "Control the TR/TD tags inside the loop so each row of the ResultSet becomes a row of the table."
    },
    {
      id: "pr12", topic: "pract", type: "mcq", difficulty: 2,
      q: "Practical 4 Part 4: how does the Edit button tell editMemberForm.jsp which member to load?",
      options: [
        "It stores the id in a static field",
        "It appends the id as a query string or sends it as a hidden form field",
        "It reads the whole table again",
        "It uses the session id"
      ],
      answer: 1,
      explain: "Query strings or hidden fields carry the id; editMemberForm.jsp reads it with request.getParameter(\"id\")."
    },
    {
      id: "pr13", topic: "pract", type: "mcq", difficulty: 3,
      q: "Why does the practical warn against == for comparing user input with a password?",
      options: [
        "== is slower than .equals()",
        "== compares object references, not the text, so two equal Strings can compare false",
        "== only works for numbers",
        "== always throws a NullPointerException"
      ],
      answer: 1,
      explain: "Use .equals() for text. Safer still: put the constant first - \"abc123\".equals(input) - so a null input cannot throw."
    },
    {
      id: "pr14", topic: "pract", type: "type", difficulty: 2,
      q: "Practical 2 Part 3 hint: which method redirects the browser to another page? response.____________(...)",
      answers: ["sendRedirect"],
      explain: "response.sendRedirect(\"login.jsp?errCode=invalidLogin\"). Follow it with return;."
    },
    {
      id: "pr15", topic: "pract", type: "multi", difficulty: 3,
      q: "Which problems do the practicals want you to defend against? (Select all that apply)",
      options: [
        "NullPointerException when a parameter is missing",
        "Showing raw user input in HTML without encoding (XSS)",
        "Concatenating user input into SQL (injection)",
        "Writing HTML inside a JSP"
      ],
      answer: [0, 1, 2],
      explain: "Writing HTML in a JSP is the normal thing to do - the traps are nulls, unencoded output and SQL concatenation."
    },
    {
      id: "pr16", topic: "pract", type: "order", difficulty: 3,
      q: "Order the request journey when a servlet forwards to a JSP (as in VerifyUser).",
      items: [
        "The browser POSTs the form to the servlet's @WebServlet URL",
        "Tomcat calls doPost, which passes the request to doGet",
        "The servlet reads parameters and sets request attributes",
        "The servlet calls dispatcher.forward(request, response)",
        "The JSP renders the page and the address bar still shows the servlet URL"
      ],
      explain: "A forward stays in the same request, so parameters and attributes survive - unlike a redirect."
    },
    {
      id: "pr17", topic: "pract", type: "mcq", difficulty: 3,
      q: "A servlet class compiles and sits in WEB-INF/classes, but its URL returns 404. What is most likely missing?",
      options: [
        "A closing brace",
        "The @WebServlet(\"/path\") annotation (or a web.xml mapping)",
        "A main method",
        "A database connection"
      ],
      answer: 1,
      explain: "Nothing tells Tomcat which URL the class answers, so no request ever reaches it."
    },
    {
      id: "pr18", topic: "pract", type: "mcq", difficulty: 2,
      q: "In checkme.jsp, why is a class-level field from <%! %> dangerous for login state?",
      options: [
        "Fields cannot hold booleans",
        "One servlet instance serves every request on many threads, so requests can overwrite each other's value",
        "Fields are reset on every request",
        "It slows the database down"
      ],
      answer: 1,
      explain: "Shared mutable state across threads. Real login state belongs in a local variable or in the session."
    },
    {
      id: "pr19", topic: "pract", type: "type", difficulty: 2,
      q: "Practical 1 Part F: which schema name does the practical tell you to create for the member table? (Practical 2/4 code uses jspg)",
      answers: ["db1", "jspg"],
      explain: "Practical 1 creates schema db1 with a member table; the lecture and later practical code use the jspg schema - check which one your project uses."
    },
    {
      id: "pr20", topic: "pract", type: "mcq", difficulty: 1,
      q: "Where do JSP and HTML files live in the Eclipse Dynamic Web Project used by the practicals?",
      options: ["src/main/java", "WebContent (src/main/webapp)", "WEB-INF/lib", "build/classes"],
      answer: 1,
      explain: "The practicals create folders such as pract2, pract3 and pract4 inside WebContent, next to WEB-INF."
    }
  ]
};
