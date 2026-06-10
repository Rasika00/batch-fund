const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Empty saveToLocalStorage
code = code.replace(/function saveToLocalStorage\(\) \{[\s\S]*?\}/, 'function saveToLocalStorage() {\n    // Removed as per request to only use DB\n}');

// Rewrite initDatabase local fallback
code = code.replace(/async function initDatabase\(\) \{[\s\S]*?filteredStudentsList = \[\.\.\.state\.students\];\n    renderApp\(\);\n\}/, 
`async function initDatabase() {
    if (useSupabase()) {
        await loadStudentsFromDB();
        await loadEventsFromDB();
        await loadTransactionsFromDB();
        await loadExpensesFromDB();
        await loadMediaFromDB();
        await loadCommentsFromDB();
    } else {
        console.error('Supabase is required but not configured.');
    }
    filteredStudentsList = [...state.students];
    renderApp();
}`);

// Rewrite applyLocalStudentFallback to just empty students
code = code.replace(/function applyLocalStudentFallback\(\) \{[\s\S]*?saveToLocalStorage\(\);\n\}/, 
`function applyLocalStudentFallback() {
    state.students = [];
    normalizeStudentMonthlyPayments();
}`);

// Update loadExpensesFromDB
code = code.replace(/} else \{\s*\/\/ Fallback to local storage if table doesn't exist or error\s*const storedExpenses = localStorage\.getItem\('rt_expenses'\);\s*state\.expenses = storedExpenses \? JSON\.parse\(storedExpenses\) : \[\];\s*\}/g,
'} else { state.expenses = []; }');

// Update loadTransactionsFromDB
code = code.replace(/} else \{\s*const storedTransactions = localStorage\.getItem\('rt_transactions'\);\s*state\.transactions = storedTransactions \? JSON\.parse\(storedTransactions\) : \[\.\.\.MOCK_TRANSACTIONS\];\s*\}/g,
'} else { state.transactions = []; }');

// Update loadEventsFromDB
code = code.replace(/} else \{\s*const storedEvents = localStorage\.getItem\('rt_events'\);\s*state\.events = storedEvents \? JSON\.parse\(storedEvents\) : \[\.\.\.MOCK_EVENTS\];\s*\}/g,
'} else { state.events = []; }');

// Update loadMediaFromDB
code = code.replace(/} else \{\s*const storedMedia = localStorage\.getItem\('rt_media'\);\s*state\.media = storedMedia \? JSON\.parse\(storedMedia\) : \[\];\s*\}/g,
'} else { state.media = []; }');

// Update loadCommentsFromDB
code = code.replace(/} else \{\s*const storedComments = localStorage\.getItem\('rt_comments'\);\s*state\.comments = storedComments \? JSON\.parse\(storedComments\) : \[\];\s*\}/g,
'} else { state.comments = []; }');

code = code.replace(/console\.warn\('Supabase unavailable for loadCommentsFromDB\.'\);\s*const storedComments = localStorage\.getItem\('rt_comments'\);\s*state\.comments = storedComments \? JSON\.parse\(storedComments\) : \[\];/g,
"console.warn('Supabase unavailable for loadCommentsFromDB.'); state.comments = [];");

fs.writeFileSync('app.js', code);
