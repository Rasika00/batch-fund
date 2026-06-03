/* -------------------------------------------------------------
 * RT Funds — Rajarata Technology 22/23
 * Core Application Engine & Reactive State Controller
 * ------------------------------------------------------------- */

// Global App State
let state = {
    students: [],
    events: [],
    transactions: [],
    currentUser: null, // Stores { email: '', role: 'Treasurer' | 'President' } if authenticated
    dashboardEventId: null
};

// loader removed — no site loader initialization
// Constant Predefined Roles & Verified University Domains
const AUTHORIZED_ADMINS = [
    { email: 'ENT2023070@tec.rjt.ac.lk', password: 'Spo3@tech', role: 'Treasurer', name: 'Salinda' },
    { email: 'itt2023097@tec.rjt.ac.lk', password: '200309700301.', role: 'Admin', name: 'Rasika' }
];
const UNIVERSITY_DOMAIN = '@tec.rjt.ac.lk';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHLY_FEE = 100;

// Sample students inserted for Technology faculty. Payment fields are intentionally omitted;
// only admins can add/modify `AmountPaid`, `AmountOwed`, and `Status`.
const MOCK_STUDENTS = [
    {IndexNumber: '2107', FullName: 'Ms. R.A.O. CHAΜΑΤΗΚΑ', RegNo: 'BST/2023/001', Department: 'Bioprocess Technology'},

{IndexNumber: '2108', FullName: 'Ms. V.N.R. COORAY', RegNo: 'BST/2023/002', Department: 'Bioprocess Technology'},

{IndexNumber: '2109', FullName: 'Ms. A.M. DANTHANARAYANA', RegNo: 'BST/2023/003', Department: 'Bioprocess Technology'},

{IndexNumber: '2110', FullName: 'Ms. B.P.C. WICKUMPRIYA', RegNo: 'BST/2023/004', Department: 'Bioprocess Technology'},

{IndexNumber: '2112', FullName: 'Ms. K.K.V. KAVINDI', RegNo: 'BST/2023/006', Department: 'Bioprocess Technology'},

{IndexNumber: '2116', FullName: 'Ms. W.A.S.S. WEERAKKODI', RegNo: 'BST/2023/010', Department: 'Bioprocess Technology'},

{IndexNumber: '2118', FullName: 'Ms. M.M.F. MUFASSIRA', RegNo: 'BST/2023/012', Department: 'Bioprocess Technology'},

{IndexNumber: '2124', FullName: 'Ms. D.B.I. ABHILASHI', RegNo: 'BST/2023/018', Department: 'Bioprocess Technology'},

{IndexNumber: '2125', FullName: 'Mr. S.J.A.I. DIHANSA', RegNo: 'BST/2023/019', Department: 'Bioprocess Technology'},

{IndexNumber: '2126', FullName: 'Ms. B.A.G. APSARA', RegNo: 'BST/2023/020', Department: 'Bioprocess Technology'},

{IndexNumber: '2132', FullName: 'Ms. G.R.S.S. GAMLATH', RegNo: 'BST/2023/026', Department: 'Bioprocess Technology'},

{IndexNumber: '2133', FullName: 'Ms. J.C. RASHANGI', RegNo: 'BST/2023/027', Department: 'Bioprocess Technology'},

{IndexNumber: '2134', FullName: 'Mr. W.I.M. WIJESINGHE', RegNo: 'BST/2023/028', Department: 'Bioprocess Technology'},

{IndexNumber: '2139', FullName: 'Ms. S.M.K.M. SENANAYAKA', RegNo: 'BST/2023/033', Department: 'Bioprocess Technology'},

{IndexNumber: '2143', FullName: 'Ms. Ε.Μ.Ν.Μ. ΕKANAYAKA', RegNo: 'BST/2023/037', Department: 'Bioprocess Technology'},

{IndexNumber: '2144', FullName: 'Ms. M.F.P. SAPΡΝΑ', RegNo: 'BST/2023/038', Department: 'Bioprocess Technology'},

{IndexNumber: '2145', FullName: 'Ms. M.J. NIFHANA', RegNo: 'BST/2023/039', Department: 'Bioprocess Technology'},

{IndexNumber: '2146', FullName: 'Ms. H.A.S.N. ABEYSINGHE', RegNo: 'BST/2023/040', Department: 'Bioprocess Technology'},

{IndexNumber: '2148', FullName: 'Ms. S.L. RASHMY', RegNo: 'BST/2023/042', Department: 'Bioprocess Technology'},

{IndexNumber: '2150', FullName: 'Ms. P.N. THILAKARATHNA', RegNo: 'BST/2023/044', Department: 'Bioprocess Technology'},

{IndexNumber: '2152', FullName: 'Мг. R.M.T.U.D. DASANAYAKA', RegNo: 'BST/2023/046', Department: 'Bioprocess Technology'},

{IndexNumber: '2154', FullName: 'Ms. A.N. WIJERATHNA', RegNo: 'BST/2023/048', Department: 'Bioprocess Technology'},

{IndexNumber: '2156', FullName: 'Ms. G.W.M.M. WIJESINGHE', RegNo: 'BST/2023/050', Department: 'Bioprocess Technology'},

{IndexNumber: '2157', FullName: 'Ms. N. DANUSIKA', RegNo: 'BST/2023/051', Department: 'Bioprocess Technology'},

{IndexNumber: '2161', FullName: 'Ms. S.W.G.K.D. KARUNARATHNA', RegNo: 'BST/2023/056', Department: 'Bioprocess Technology'},

{IndexNumber: '2163', FullName: 'Mr. A.G.P.B.B. ABEYRATHΝΑ', RegNo: 'BST/2023/058', Department: 'Bioprocess Technology'},

{IndexNumber: '2164', FullName: 'Ms. B.M. NIGAMUNI', RegNo: 'BST/2023/059', Department: 'Bioprocess Technology'},

{IndexNumber: '2165', FullName: 'Mr. G.G.T.T. WIJERATHNA', RegNo: 'BST/2023/060', Department: 'Bioprocess Technology'},

{IndexNumber: '2166', FullName: 'Mr. K.H.W.M.U.W.A.S.B. Elkaduwa', RegNo: 'BST/2023/061', Department: 'Bioprocess Technology'},

{IndexNumber: '2170', FullName: 'Ms. R.G.K.H. JAYATHILAKA', RegNo: 'BST/2023/065', Department: 'Bioprocess Technology'},

{IndexNumber: '2172', FullName: 'Ms. A.M.D.K.M. ALAHAKOON', RegNo: 'BST/2023/067', Department: 'Bioprocess Technology'},

{IndexNumber: '2176', FullName: 'Ms. N.A. INUPAΜΑ', RegNo: 'BST/2023/071', Department: 'Bioprocess Technology'},

{IndexNumber: '2177', FullName: 'Ms. W.M.S. SANSALA', RegNo: 'BST/2023/072', Department: 'Bioprocess Technology'},

{IndexNumber: '2179', FullName: 'Mr. J.M.P. BANDARA', RegNo: 'BST/2023/074', Department: 'Bioprocess Technology'},

{IndexNumber: '2182', FullName: 'Mr. C.W.M.A.C.D. JAYATHILAKA', RegNo: 'BST/2023/077', Department: 'Bioprocess Technology'},

{IndexNumber: '2186', FullName: 'Ms. K. VIJITHA', RegNo: 'BST/2023/081', Department: 'Bioprocess Technology'},

{IndexNumber: '2187', FullName: 'Ms. M.H.F. HAMTHA', RegNo: 'BST/2023/082', Department: 'Bioprocess Technology'},

{IndexNumber: '2189', FullName: 'Ms. R. VIJAYAKUMARAN', RegNo: 'BST/2023/084', Department: 'Bioprocess Technology'},

{IndexNumber: '2190', FullName: 'Mr. T. THANOJAN', RegNo: 'BST/2023/085', Department: 'Bioprocess Technology'},

{IndexNumber: '2192', FullName: 'Ms. G.H.G. MADHUBHASHINI', RegNo: 'BST/2023/088', Department: 'Bioprocess Technology'},

{IndexNumber: '2193', FullName: 'Мг. J.A.S.P. JAYASOORIYA', RegNo: 'BST/2023/089', Department: 'Bioprocess Technology'},

{IndexNumber: '2197', FullName: 'Ms. B.D.C. VINODA', RegNo: 'BST/2023/093', Department: 'Bioprocess Technology'},

{IndexNumber: '2201', FullName: 'Ms. H.M.S.A. HERATH', RegNo: 'BST/2023/097', Department: 'Bioprocess Technology'},

{IndexNumber: '2203', FullName: 'Ms. Α.Α.Κ.Η. ADHIKARI', RegNo: 'BST/2023/099', Department: 'Bioprocess Technology'},

{IndexNumber: '2204', FullName: 'Ms. A.Η.Μ.Μ.L. ABERATHΝΑ', RegNo: 'BST/2023/100', Department: 'Bioprocess Technology'},

{IndexNumber: '2205', FullName: 'Mr. M.P.G.S. KAVISHAN M.P.G.S.', RegNo: 'BST/2023/101', Department: 'Bioprocess Technology'},

{IndexNumber: '2206', FullName: 'Ms. KW.M.N.P. KARUNARATHNA W.Μ.Ν.Ρ.', RegNo: 'BST/2023/102', Department: 'Bioprocess Technology'},

{IndexNumber: '2208', FullName: 'Ms. W.M.S.N. GUNATHILAKA', RegNo: 'BST/2023/104', Department: 'Bioprocess Technology'},
{IndexNumber: '2210', FullName: 'Mr. L.A.D.T. DIAS', RegNo: 'ENT/2023/002', Department: 'Materials Technology'},

{IndexNumber: '2214', FullName: 'Mr. J.T.W. DE SILVA', RegNo: 'ENT/2023/007', Department: 'Materials Technology'},

{IndexNumber: '2215', FullName: 'Mr. B.A.D.S. NETHSARA', RegNo: 'ENT/2023/008', Department: 'Materials Technology'},

{IndexNumber: '2216', FullName: 'Mr. J.P.Y. LAKSHAN', RegNo: 'ENT/2023/009', Department: 'Materials Technology'},

{IndexNumber: '2218', FullName: 'Mr. Κ.Α.Α. ΙΜANSITH', RegNo: 'ENT/2023/011', Department: 'Materials Technology'},

{IndexNumber: '2222', FullName: 'Mr. K.A.D.I.Y.P. KODITHUWAKKU', RegNo: 'ENT/2023/015', Department: 'Materials Technology'},

{IndexNumber: '2229', FullName: 'Mr. N.G.I.S. MADUWANTHA', RegNo: 'ENT/2023/022', Department: 'Materials Technology'},

{IndexNumber: '2230', FullName: 'Mr. A.H.D. KOSWATHTHA', RegNo: 'ENT/2023/023', Department: 'Materials Technology'},

{IndexNumber: '2231', FullName: 'Mr. U.R.R.U. BANDARA', RegNo: 'ENT/2023/024', Department: 'Materials Technology'},

{IndexNumber: '2233', FullName: 'Mr. H.M.U.I. KARUNARATΗΝΑ', RegNo: 'ENT/2023/026', Department: 'Materials Technology'},

{IndexNumber: '2240', FullName: 'Mr. S.N. SANKALPA', RegNo: 'ENT/2023/033', Department: 'Materials Technology'},

{IndexNumber: '2243', FullName: 'Mr. N.M. NUSKI', RegNo: 'ENT/2023/036', Department: 'Materials Technology'},

{IndexNumber: '2244', FullName: 'Mr. M.F.M. BASITH', RegNo: 'ENT/2023/037', Department: 'Materials Technology'},

{IndexNumber: '2247', FullName: 'Mr. P.K.L. PEMASIRI', RegNo: 'ENT/2023/040', Department: 'Materials Technology'},

{IndexNumber: '2249', FullName: 'Mr. D.P.C.S. DASSANAYAKE', RegNo: 'ENT/2023/042', Department: 'Materials Technology'},

{IndexNumber: '2250', FullName: 'Mr. K.S.P. SIRIWARDHANA', RegNo: 'ENT/2023/043', Department: 'Materials Technology'},

{IndexNumber: '2251', FullName: 'Mr. T.M.A.B. JAYARATHNA', RegNo: 'ENT/2023/044', Department: 'Materials Technology'},

{IndexNumber: '2255', FullName: 'Mr. K.G.A.I. RATHNAYAKA', RegNo: 'ENT/2023/048', Department: 'Materials Technology'},

{IndexNumber: '2256', FullName: 'Mr. A.G.T.R. DESHAPPRIYA', RegNo: 'ENT/2023/049', Department: 'Materials Technology'},

{IndexNumber: '2261', FullName: 'Mr. M.S.M. SHIRAS', RegNo: 'ENT/2023/054', Department: 'Materials Technology'},

{IndexNumber: '2262', FullName: 'Mr. A.P.G.C.B. AMARASINGHE', RegNo: 'ENT/2023/055', Department: 'Materials Technology'},

{IndexNumber: '2266', FullName: 'Ms. M.A.U.N.P. WIMALARATΗΝΑ', RegNo: 'ENT/2023/059', Department: 'Materials Technology'},

{IndexNumber: '2269', FullName: 'Mr. R.M.I.A. BANDARA', RegNo: 'ENT/2023/062', Department: 'Materials Technology'},

{IndexNumber: '2270', FullName: 'Mr. D.M.M.S. DISSANAYAKE', RegNo: 'ENT/2023/063', Department: 'Materials Technology'},

{IndexNumber: '2271', FullName: 'Mr. K.A.S.M. SURASINGHE', RegNo: 'ENT/2023/064', Department: 'Materials Technology'},

{IndexNumber: '2272', FullName: 'Mr. M.G.M.B. MUDUNKOTHGEDARA', RegNo: 'ENT/2023/065', Department: 'Materials Technology'},

{IndexNumber: '2274', FullName: 'Mr. B.B.S.S.G. PARANAGAMA', RegNo: 'ENT/2023/067', Department: 'Materials Technology'},

{IndexNumber: '2278', FullName: 'Mr. K.H.G.S.B. RATHNAYAKA', RegNo: 'ENT/2023/071', Department: 'Materials Technology'},

{IndexNumber: '2280', FullName: 'Mr. S.C.D. PARAMANANDA', RegNo: 'ENT/2023/074', Department: 'Materials Technology'},

{IndexNumber: '2281', FullName: 'Ms. E.G.C.M. HERATH', RegNo: 'ENT/2023/075', Department: 'Materials Technology'},

{IndexNumber: '2282', FullName: 'Mr. Ν.Μ.Ν.Ν. GUNARATHNA', RegNo: 'ENT/2023/076', Department: 'Materials Technology'},

{IndexNumber: '2284', FullName: 'Mr. T.M.S.N. THENNAKOON', RegNo: 'ENT/2023/078', Department: 'Materials Technology'},

{IndexNumber: '2287', FullName: 'Mr. T.M.S. THARUKA', RegNo: 'ENT/2023/081', Department: 'Materials Technology'},

{IndexNumber: '2288', FullName: 'Mr. W.M.A.K. WEERARATΗΝΑ', RegNo: 'ENT/2023/082', Department: 'Materials Technology'},

{IndexNumber: '2292', FullName: 'Mr. A.M. ZAKKER', RegNo: 'ENT/2023/086', Department: 'Materials Technology'},

{IndexNumber: '2293', FullName: 'Mr. F.M. HASIK', RegNo: 'ENT/2023/087', Department: 'Materials Technology'},

{IndexNumber: '2295', FullName: 'Mr. M.H.A. RILA', RegNo: 'ENT/2023/089', Department: 'Materials Technology'},

{IndexNumber: '2297', FullName: 'Mr. M.M.M. RILA', RegNo: 'ENT/2023/091', Department: 'Materials Technology'},

{IndexNumber: '2298', FullName: 'Mr. J. PRASANNATH', RegNo: 'ENT/2023/092', Department: 'Materials Technology'},

{IndexNumber: '2302', FullName: 'Mr. N. NATHUJAN', RegNo: 'ENT/2023/096', Department: 'Materials Technology'},

{IndexNumber: '2303', FullName: 'Mr. T. KOKUL', RegNo: 'ENT/2023/097', Department: 'Materials Technology'},

{IndexNumber: '2307', FullName: 'Mr. W.A.M.M. THILAKARATHNA', RegNo: 'ENT/2023/101', Department: 'Materials Technology'},

{IndexNumber: '2310', FullName: 'Mr. M. THIVAKAR', RegNo: 'ENT/2023/104', Department: 'Materials Technology'},

{IndexNumber: '2312', FullName: 'Mr. W.A.I.D. WANASINGHE', RegNo: 'ENT/2023/107', Department: 'Materials Technology'},

{IndexNumber: '2314', FullName: 'Mr. G.A.P.S.H. PATHMAKUMARA', RegNo: 'ENT/2023/109', Department: 'Materials Technology'},

{IndexNumber: '2315', FullName: 'Mr. D.J.M. DUNUWILA', RegNo: 'ENT/2023/110', Department: 'Materials Technology'},

{IndexNumber: '2319', FullName: 'Ms. U.P.C. NIMASHA', RegNo: 'ENT/2023/114', Department: 'Materials Technology'},

{IndexNumber: '2320', FullName: 'Ms. A.R.W.M.B.W.C.N. DASANAYAKA', RegNo: 'ENT/2023/115', Department: 'Materials Technology'},

{IndexNumber: '2321', FullName: 'Mr. M.D.G.N.J. GUNATHILAKA', RegNo: 'ENT/2023/116', Department: 'Materials Technology'},

{IndexNumber: '2322', FullName: 'Mr. S.M.L.D. SAMARAKOON', RegNo: 'ENT/2023/117', Department: 'Materials Technology'},

{IndexNumber: '2325', FullName: 'Ms. M.S. LAKSHIKA', RegNo: 'ENT/2023/120', Department: 'Materials Technology'},

{IndexNumber: '2332', FullName: 'Mr. W.M. MUNSIF W.M.', RegNo: 'ENT/2023/128', Department: 'Materials Technology'},

{IndexNumber: '2333', FullName: 'Mr. G.O.G.S.D. BANDARA', RegNo: 'ENT/2023/129', Department: 'Materials Technology'},

{IndexNumber: '2456', FullName: 'Mr. K.L.J. JAYAWICKRAMA', RegNo: 'ENT/2023/130', Department: 'Materials Technology'},

{IndexNumber: '2457', FullName: 'Ms. A.K.M. RAJAKARUNA', RegNo: 'ENT/2022/137', Department: 'Materials Technology'},

{IndexNumber: '1875', FullName: 'Mr. G.A.I.N. GANGALAGAMUWA', RegNo: 'ENT/2022/026', Department: 'Materials Technology'},
{IndexNumber: '2334', FullName: 'Mr. H.D.R. ΜΕΤΗNUKA', RegNo: 'ITT/2023/001', Department: 'Information Technology'},

{IndexNumber: '2335', FullName: 'Mr. K.A.D.T.D. KARIYAPPERUMA', RegNo: 'ITT/2023/003', Department: 'Information Technology'},

{IndexNumber: '2336', FullName: 'Mr. T.T. KOORAGAMAGE', RegNo: 'ITT/2023/004', Department: 'Information Technology'},

{IndexNumber: '2338', FullName: 'Mr. W.D. MATHISHA', RegNo: 'ITT/2023/006', Department: 'Information Technology'},

{IndexNumber: '2339', FullName: 'Mr. M.V. SUDASINGHA', RegNo: 'ITT/2023/007', Department: 'Information Technology'},

{IndexNumber: '2340', FullName: 'Mr. S.D. WEERASINGHE', RegNo: 'ITT/2023/008', Department: 'Information Technology'},

{IndexNumber: '2341', FullName: 'Mr. A.L.P. ABEYSINGHE', RegNo: 'ITT/2023/009', Department: 'Information Technology'},

{IndexNumber: '2342', FullName: 'Mr. H.U.M. HEWAINNA', RegNo: 'ITT/2023/010', Department: 'Information Technology'},

{IndexNumber: '2343', FullName: 'Mr. K.A.W.M. NETHRANGA', RegNo: 'ITT/2023/011', Department: 'Information Technology'},

{IndexNumber: '2344', FullName: 'Mr. R.A.T.S. RANAWEERA', RegNo: 'ITT/2023/012', Department: 'Information Technology'},

{IndexNumber: '2345', FullName: 'Ms. K.A.S.S. KULAPERUMA', RegNo: 'ITT/2023/013', Department: 'Information Technology'},

{IndexNumber: '2346', FullName: 'Mr. Y.A. NIRMAL', RegNo: 'ITT/2023/014', Department: 'Information Technology'},

{IndexNumber: '2347', FullName: 'Mr. M.T.C.Y. KUMARA', RegNo: 'ITT/2023/015', Department: 'Information Technology'},

{IndexNumber: '2348', FullName: 'Mr. J.R.D. WIJERATHNE', RegNo: 'ITT/2023/016', Department: 'Information Technology'},

{IndexNumber: '2349', FullName: 'Mr. W.A.S.R. JAYAWARDANA', RegNo: 'ITT/2023/017', Department: 'Information Technology'},

{IndexNumber: '2350', FullName: 'Mr. S.A.D.K. LAKSHITHA', RegNo: 'ITT/2023/018', Department: 'Information Technology'},

{IndexNumber: '2351', FullName: 'Mr. U.V.V.B. MADHURANGA', RegNo: 'ITT/2023/019', Department: 'Information Technology'},

{IndexNumber: '2352', FullName: 'Ms. P.D.C. MALMUTHU', RegNo: 'ITT/2023/020', Department: 'Information Technology'},

{IndexNumber: '2353', FullName: 'Mr. H.H.D.V. ISHAN', RegNo: 'ITT/2023/021', Department: 'Information Technology'},

{IndexNumber: '2354', FullName: 'Mr. U.H.G.R. MADUSHAN', RegNo: 'ITT/2023/022', Department: 'Information Technology'},

{IndexNumber: '2355', FullName: 'Mr. L.S. SANKALANA', RegNo: 'ITT/2023/023', Department: 'Information Technology'},

{IndexNumber: '2356', FullName: 'Mr. W.M.S. KAUSHALYA', RegNo: 'ITT/2023/024', Department: 'Information Technology'},

{IndexNumber: '2357', FullName: 'Mr. H.A.D.R. SANDAKULA', RegNo: 'ITT/2023/025', Department: 'Information Technology'},

{IndexNumber: '2358', FullName: 'Mr. K.R.T.S.S. RANAWEERA', RegNo: 'ITT/2023/026', Department: 'Information Technology'},

{IndexNumber: '2359', FullName: 'Ms. R.A.G. PABASARA', RegNo: 'ITT/2023/028', Department: 'Information Technology'},

{IndexNumber: '2360', FullName: 'Mr. U.B.S.L. MADUSANKA', RegNo: 'ITT/2023/029', Department: 'Information Technology'},

{IndexNumber: '2361', FullName: 'Ms. A.G.C.A. NURANI', RegNo: 'ITT/2023/030', Department: 'Information Technology'},

{IndexNumber: '2362', FullName: 'Ms. H.W.D.I. ISHANTHI', RegNo: 'ITT/2023/031', Department: 'Information Technology'},

{IndexNumber: '2363', FullName: 'Mr. Y.D. RAMANAYAKA', RegNo: 'ITT/2023/032', Department: 'Information Technology'},

{IndexNumber: '2364', FullName: 'Ms. U.H.R. SHASHINI', RegNo: 'ITT/2023/033', Department: 'Information Technology'},

{IndexNumber: '2365', FullName: 'Mr. M.M.D. SHASHIN', RegNo: 'ITT/2023/034', Department: 'Information Technology'},

{IndexNumber: '2366', FullName: 'Ms. S.C. PARANAWITHANA', RegNo: 'ITT/2023/035', Department: 'Information Technology'},

{IndexNumber: '2367', FullName: 'Ms. A.U. JAYAMINI', RegNo: 'ITT/2023/036', Department: 'Information Technology'},

{IndexNumber: '2368', FullName: 'Mr. N.K.S. SENADEERA', RegNo: 'ITT/2023/037', Department: 'Information Technology'},

{IndexNumber: '2369', FullName: 'Ms. K.G.I.S. GUNAWARDANA', RegNo: 'ITT/2023/038', Department: 'Information Technology'},

{IndexNumber: '2370', FullName: 'Mr. D.A.S.S. WEERASOORIYA', RegNo: 'ITT/2023/039', Department: 'Information Technology'},

{IndexNumber: '2371', FullName: 'Mr. S.H.S.N. DISSANAYAKE', RegNo: 'ITT/2023/040', Department: 'Information Technology'},

{IndexNumber: '2372', FullName: 'Mr. K.T.N. WIJETHUNGA', RegNo: 'ITT/2023/041', Department: 'Information Technology'},

{IndexNumber: '2373', FullName: 'Mr. M.P.Y.P. MADURANGA', RegNo: 'ITT/2023/042', Department: 'Information Technology'},

{IndexNumber: '2374', FullName: 'Mr. W.M.S.T. WEERASINGHE', RegNo: 'ITT/2023/043', Department: 'Information Technology'},

{IndexNumber: '2375', FullName: 'Mr. T.A.S.A. EDWARD', RegNo: 'ITT/2023/044', Department: 'Information Technology'},

{IndexNumber: '2376', FullName: 'Mr. L.H.S.B. SENAVIRATHΝΑ', RegNo: 'ITT/2023/045', Department: 'Information Technology'},

{IndexNumber: '2377', FullName: 'Ms. M.F.F. SASNA', RegNo: 'ITT/2023/046', Department: 'Information Technology'},

{IndexNumber: '2379', FullName: 'Mr. M.D.S.W. JAYASINGHE', RegNo: 'ITT/2023/048', Department: 'Information Technology'},

{IndexNumber: '2380', FullName: 'Mr. D.M.G.S.N. NANDATISSA', RegNo: 'ITT/2023/049', Department: 'Information Technology'},

{IndexNumber: '2381', FullName: 'Mr. H.M.R.M. HERATH', RegNo: 'ITT/2023/050', Department: 'Information Technology'},

{IndexNumber: '2382', FullName: 'Mr. H.M.U.P. HERATH', RegNo: 'ITT/2023/052', Department: 'Information Technology'},

{IndexNumber: '2383', FullName: 'Mr. R.M.H.T.A. BANDARA', RegNo: 'ITT/2023/053', Department: 'Information Technology'},

{IndexNumber: '2384', FullName: 'Mr. W.M.V.D. WIJESINGHE', RegNo: 'ITT/2023/054', Department: 'Information Technology'},

{IndexNumber: '2385', FullName: 'Ms. D.U.P. JAYASEKARA', RegNo: 'ITT/2023/055', Department: 'Information Technology'},

{IndexNumber: '2386', FullName: 'Mr. D.M.R.K.H. SENADHEERA', RegNo: 'ITT/2023/056', Department: 'Information Technology'},

{IndexNumber: '2387', FullName: 'Ms. L.R.G.J. PATHIRAJA', RegNo: 'ITT/2023/057', Department: 'Information Technology'},

{IndexNumber: '2388', FullName: 'Mr. M.D.A.V. GUNATHUNGA', RegNo: 'ITT/2023/058', Department: 'Information Technology'},

{IndexNumber: '2389', FullName: 'Mr. H.M.P.D. HERATH', RegNo: 'ITT/2023/059', Department: 'Information Technology'},

{IndexNumber: '2390', FullName: 'Mr. A.A. AHMAD', RegNo: 'ITT/2023/060', Department: 'Information Technology'},

{IndexNumber: '2391', FullName: 'Mr. S.M. SABEETH', RegNo: 'ITT/2023/061', Department: 'Information Technology'},

{IndexNumber: '2392', FullName: 'Ms. A.M.L. NAVODYA', RegNo: 'ITT/2023/062', Department: 'Information Technology'},

{IndexNumber: '2393', FullName: 'Mr. M.M.S.D. MENDIS', RegNo: 'ITT/2023/063', Department: 'Information Technology'},

{IndexNumber: '2394', FullName: 'Mr. W.N.S. FERNANDO', RegNo: 'ITT/2023/064', Department: 'Information Technology'},

{IndexNumber: '2395', FullName: 'Ms. D.A.S. JAYAWARDHANA', RegNo: 'ITT/2023/065', Department: 'Information Technology'},

{IndexNumber: '2396', FullName: 'Mr. M.G.N.K WIJERATHNA', RegNo: 'ITT/2023/066', Department: 'Information Technology'},

{IndexNumber: '2397', FullName: 'Ms. T.N.U. SILVA', RegNo: 'ITT/2023/067', Department: 'Information Technology'},

{IndexNumber: '2398', FullName: 'Mr. Α.Η.Μ.Μ.Ι.Μ. ABEYRATHNA', RegNo: 'ITT/2023/068', Department: 'Information Technology'},

{IndexNumber: '2399', FullName: 'Ms. S.M.N.M. JAYAWARDHANA', RegNo: 'ITT/2023/070', Department: 'Information Technology'},

{IndexNumber: '2400', FullName: 'Mr. A.M.E.R. BANDARA', RegNo: 'ITT/2023/071', Department: 'Information Technology'},

{IndexNumber: '2401', FullName: 'Ms. L.G.H.D.I. HARISCHANDRA', RegNo: 'ITT/2023/072', Department: 'Information Technology'},

{IndexNumber: '2402', FullName: 'Ms. S.G.M.S.M. SENAVIRATΗΝΑ', RegNo: 'ITT/2023/073', Department: 'Information Technology'},

{IndexNumber: '2403', FullName: 'Mr. D.K.G.K.A. DISANAYAKA', RegNo: 'ITT/2023/074', Department: 'Information Technology'},

{IndexNumber: '2404', FullName: 'Mr. P.M.D.W. KUMARA', RegNo: 'ITT/2023/075', Department: 'Information Technology'},

{IndexNumber: '2405', FullName: 'Mr. R.H.P. RATHNAYAKA', RegNo: 'ITT/2023/076', Department: 'Information Technology'},

{IndexNumber: '2406', FullName: 'Ms. M.S.S. FARVIN', RegNo: 'ITT/2023/077', Department: 'Information Technology'},

{IndexNumber: '2407', FullName: 'Mr. W.A.T.S. WEERAWANSHA', RegNo: 'ITT/2023/078', Department: 'Information Technology'},

{IndexNumber: '2408', FullName: 'Mr. K.M.C.N. VEERAKON', RegNo: 'ITT/2023/079', Department: 'Information Technology'},

{IndexNumber: '2409', FullName: 'Mr. B.G.P.D. ABERATHNE', RegNo: 'ITT/2023/080', Department: 'Information Technology'},

{IndexNumber: '2410', FullName: 'Ms. D.M.C.N. DISSANAYAKA', RegNo: 'ITT/2023/081', Department: 'Information Technology'},

{IndexNumber: '2411', FullName: 'Mr. D.G.S.S. ABEYRATHNE', RegNo: 'ITT/2023/082', Department: 'Information Technology'},

{IndexNumber: '2412', FullName: 'Ms. H.M.P.T.J.B. HANWELLA', RegNo: 'ITT/2023/083', Department: 'Information Technology'},

{IndexNumber: '2413', FullName: 'Ms. N.G.L.B. KARUNATHILAKE', RegNo: 'ITT/2023/084', Department: 'Information Technology'},

{IndexNumber: '2414', FullName: 'Mr. K.S.C.C. BANDARA', RegNo: 'ITT/2023/085', Department: 'Information Technology'},

{IndexNumber: '2415', FullName: 'Mr. M.G.L.H. KARUNARATHΝΑ', RegNo: 'ITT/2023/086', Department: 'Information Technology'},

{IndexNumber: '2416', FullName: 'Mr. K.K.C. KARUNARATHNA', RegNo: 'ITT/2023/087', Department: 'Information Technology'},

{IndexNumber: '2417', FullName: 'Mr. P.D.S. ANUHAS', RegNo: 'ITT/2023/088', Department: 'Information Technology'},

{IndexNumber: '2418', FullName: 'Ms. H.M.I.G.D. PRATHIBHA', RegNo: 'ITT/2023/089', Department: 'Information Technology'},

{IndexNumber: '2419', FullName: 'Ms. K.G.P.Y. KOTTAGODA', RegNo: 'ITT/2023/090', Department: 'Information Technology'},

{IndexNumber: '2420', FullName: 'Mr. M. THILIPKUMAR', RegNo: 'ITT/2023/091', Department: 'Information Technology'},

{IndexNumber: '2422', FullName: 'Mr. R. VINOJAN', RegNo: 'ITT/2023/093', Department: 'Information Technology'},

{IndexNumber: '2423', FullName: 'Ms. W.M.A.M. WIJEKOON', RegNo: 'ITT/2023/094', Department: 'Information Technology'},

{IndexNumber: '2424', FullName: 'Ms. H.L.J.O. LAYANGANA', RegNo: 'ITT/2023/095', Department: 'Information Technology'},

{IndexNumber: '2425', FullName: 'Ms. T.M.R.D. TENNAKOON', RegNo: 'ITT/2023/096', Department: 'Information Technology'},

{IndexNumber: '2426', FullName: 'Mr. H.M.R.P. SURAWEERA', RegNo: 'ITT/2023/097', Department: 'Information Technology'},

{IndexNumber: '2427', FullName: 'Mr. A.S.R. SENARATHNA', RegNo: 'ITT/2023/098', Department: 'Information Technology'},

{IndexNumber: '2428', FullName: 'Ms. D.M.I.W. DISANAYAKA', RegNo: 'ITT/2023/099', Department: 'Information Technology'},

{IndexNumber: '2429', FullName: 'Mr. D.M.S.L. DISANAYAKA', RegNo: 'ITT/2023/100', Department: 'Information Technology'},

{IndexNumber: '2430', FullName: 'Ms. B.B.S.P.A. BANDA', RegNo: 'ITT/2023/101', Department: 'Information Technology'},

{IndexNumber: '2431', FullName: 'Ms. K.C.D. SENAVIRATHNA', RegNo: 'ITT/2023/102', Department: 'Information Technology'},

{IndexNumber: '2432', FullName: 'Mr. M.H.A. ANEEK', RegNo: 'ITT/2023/103', Department: 'Information Technology'},

{IndexNumber: '2433', FullName: 'Mr. S. THANUJITHAN', RegNo: 'ITT/2023/104', Department: 'Information Technology'},

{IndexNumber: '2434', FullName: 'Mr. P. NILOJAN', RegNo: 'ITT/2023/105', Department: 'Information Technology'},

{IndexNumber: '2435', FullName: 'Mr. S. PRAVEEN', RegNo: 'ITT/2023/106', Department: 'Information Technology'},

{IndexNumber: '2436', FullName: 'Mr. Y. JATHURSHAN', RegNo: 'ITT/2023/107', Department: 'Information Technology'},

{IndexNumber: '2437', FullName: 'Mr. T. THANANSHAYAN', RegNo: 'ITT/2023/108', Department: 'Information Technology'},

{IndexNumber: '2438', FullName: 'Mr. M.S.M. AMHAR', RegNo: 'ITT/2023/109', Department: 'Information Technology'},

{IndexNumber: '2439', FullName: 'Mr. S.F. MUHAMMAD', RegNo: 'ITT/2023/110', Department: 'Information Technology'},

{IndexNumber: '2440', FullName: 'Ms. A.S.F. NUHA', RegNo: 'ITT/2023/111', Department: 'Information Technology'},

{IndexNumber: '2441', FullName: 'Ms. M.F.F. MUSLIMA', RegNo: 'ITT/2023/112', Department: 'Information Technology'},

{IndexNumber: '2442', FullName: 'Ms. M.N.F. NAJA', RegNo: 'ITT/2023/113', Department: 'Information Technology'},

{IndexNumber: '2443', FullName: 'Ms. U.F. FARHA', RegNo: 'ITT/2023/114', Department: 'Information Technology'},

{IndexNumber: '2444', FullName: 'Mr. T. SUPANUSAN', RegNo: 'ITT/2023/115', Department: 'Information Technology'},

{IndexNumber: '2445', FullName: 'Mr. T. KIRUSHNAN', RegNo: 'ITT/2023/116', Department: 'Information Technology'},

{IndexNumber: '2446', FullName: 'Mr. R. PATHUSHAN', RegNo: 'ITT/2023/117', Department: 'Information Technology'},

{IndexNumber: '2447', FullName: 'Mr. G.F. JOSIYA G', RegNo: 'ITT/2023/118', Department: 'Information Technology'},

{IndexNumber: '2448', FullName: 'Ms. Κ.Α.Η. DEWMINI', RegNo: 'ITT/2023/119', Department: 'Information Technology'},

{IndexNumber: '2449', FullName: 'Mr. M.A.S. NAVOD', RegNo: 'ITT/2023/120', Department: 'Information Technology'},

{IndexNumber: '2450', FullName: 'Ms. R.A. KAVINDI', RegNo: 'ITT/2023/121', Department: 'Information Technology'},

{IndexNumber: '2451', FullName: 'Mr. L.V.L.S. JAYARAΤΗΝΑ', RegNo: 'ITT/2023/122', Department: 'Information Technology'},

{IndexNumber: '2452', FullName: 'Mr. W.B.D.W. BANDARA', RegNo: 'ITT/2023/123', Department: 'Information Technology'},

{IndexNumber: '2453', FullName: 'Mr. W.A.R. MADHUWANTHA', RegNo: 'ITT/2023/124', Department: 'Information Technology'},

{IndexNumber: '2455', FullName: 'Ms. G.D.S. PERERA', RegNo: 'ITT/2023/126', Department: 'Information Technology'},
{IndexNumber: '2111', FullName: 'Ms. W.V.W.C. RASHMIKA', RegNo: 'BST/2023/005', Department: 'Food Technology'},

{IndexNumber: '2113', FullName: 'Ms. Α.Μ.Α.Η. RAVINDYA', RegNo: 'BST/2023/007', Department: 'Food Technology'},

{IndexNumber: '2114', FullName: 'Ms. R.K.P. LAKMINI', RegNo: 'BST/2023/008', Department: 'Food Technology'},

{IndexNumber: '2115', FullName: 'Ms. S. WEERAKKODI', RegNo: 'BST/2023/009', Department: 'Food Technology'},

{IndexNumber: '2117', FullName: 'Ms. A.K. ILEPERUMA', RegNo: 'BST/2023/011', Department: 'Food Technology'},

{IndexNumber: '2119', FullName: 'Ms. K.H.K. THARASARI', RegNo: 'BST/2023/013', Department: 'Food Technology'},

{IndexNumber: '2120', FullName: 'Mr. M.D.K.T. NIMSARA', RegNo: 'BST/2023/014', Department: 'Food Technology'},

{IndexNumber: '2122', FullName: 'Ms. K.A.I. SHYAMEENDI', RegNo: 'BST/2023/016', Department: 'Food Technology'},

{IndexNumber: '2123', FullName: 'Ms. U.J.L. RASANGI', RegNo: 'BST/2023/017', Department: 'Food Technology'},

{IndexNumber: '2127', FullName: 'Ms. K.G.D.K. KARUNARATΗΝΑ', RegNo: 'BST/2023/021', Department: 'Food Technology'},

{IndexNumber: '2128', FullName: 'Ms. R.D.N.D. MADUWANTHI', RegNo: 'BST/2023/022', Department: 'Food Technology'},

{IndexNumber: '2129', FullName: 'Ms. I.M.S.L. ILUKKUMBURA', RegNo: 'BST/2023/023', Department: 'Food Technology'},

{IndexNumber: '2130', FullName: 'Ms. K.H.S.K. DHARMASRI', RegNo: 'BST/2023/024', Department: 'Food Technology'},

{IndexNumber: '2131', FullName: 'Ms. Κ.Α.Α. ΝΙMANTHIKA', RegNo: 'BST/2023/025', Department: 'Food Technology'},

{IndexNumber: '2135', FullName: 'Ms. M.I. SHEMA', RegNo: 'BST/2023/029', Department: 'Food Technology'},

{IndexNumber: '2136', FullName: 'Ms. K.G.S.B. DAYARATHNAB', RegNo: 'BST/2023/030', Department: 'Food Technology'},

{IndexNumber: '2137', FullName: 'Mr. W.M.K.D. WICKRAMASINGHA', RegNo: 'BST/2023/031', Department: 'Food Technology'},

{IndexNumber: '2138', FullName: 'Ms. K.S. NIMSARA', RegNo: 'BST/2023/032', Department: 'Food Technology'},

{IndexNumber: '2140', FullName: 'Ms. H.H.N. HAPUARACHCHI', RegNo: 'BST/2023/034', Department: 'Food Technology'},

{IndexNumber: '2141', FullName: 'Ms. R.M.S.H. RATHNAYAKA', RegNo: 'BST/2023/035', Department: 'Food Technology'},

{IndexNumber: '2142', FullName: 'Mr. M.S.S. SANDARUWAN', RegNo: 'BST/2023/036', Department: 'Food Technology'},

{IndexNumber: '2147', FullName: 'Ms. M.A.F. ASLA', RegNo: 'BST/2023/041', Department: 'Food Technology'},

{IndexNumber: '2149', FullName: 'Mr. H.A.G. RANJANA', RegNo: 'BST/2023/043', Department: 'Food Technology'},

{IndexNumber: '2151', FullName: 'Mr. Ε.Μ.Ι.Ν. ΕKANAYAKA', RegNo: 'BST/2023/045', Department: 'Food Technology'},

{IndexNumber: '2153', FullName: 'Ms. B.M.U.N. JAYANETHTHI', RegNo: 'BST/2023/047', Department: 'Food Technology'},

{IndexNumber: '2155', FullName: 'Mr. R.K.S. RANASINGHA', RegNo: 'BST/2023/049', Department: 'Food Technology'},

{IndexNumber: '2158', FullName: 'Ms. S. KRISHNAVENI', RegNo: 'BST/2023/052', Department: 'Food Technology'},

{IndexNumber: '2159', FullName: 'Ms. A.P.V.B.T. KAUSHALYA', RegNo: 'BST/2023/053', Department: 'Food Technology'},

{IndexNumber: '2160', FullName: 'Ms. G.G.P.S.E. JAYASINGHE', RegNo: 'BST/2023/054', Department: 'Food Technology'},

{IndexNumber: '2167', FullName: 'Ms. H.G.B.D. RANARAJA', RegNo: 'BST/2023/062', Department: 'Food Technology'},

{IndexNumber: '2168', FullName: 'Ms. U.D.T.K. UDATHENNA', RegNo: 'BST/2023/063', Department: 'Food Technology'},

{IndexNumber: '2169', FullName: 'Ms. W.M.N. MADHUSHIKA', RegNo: 'BST/2023/064', Department: 'Food Technology'},

{IndexNumber: '2171', FullName: 'Ms. S.D.G.M.S. BALASURIYA', RegNo: 'BST/2023/066', Department: 'Food Technology'},

{IndexNumber: '2173', FullName: 'Mr. D.M.C.S.D. THILAKARATHNA', RegNo: 'BST/2023/068', Department: 'Food Technology'},

{IndexNumber: '2174', FullName: 'Ms. M.G.S. KUMUDUMALI', RegNo: 'BST/2023/069', Department: 'Food Technology'},

{IndexNumber: '2175', FullName: 'Ms. D.G.K.H. ABEYRATHNA', RegNo: 'BST/2023/070', Department: 'Food Technology'},

{IndexNumber: '2178', FullName: 'Ms. D.M.I. NETΤHMI', RegNo: 'BST/2023/073', Department: 'Food Technology'},

{IndexNumber: '2180', FullName: 'Ms. M.R.F. RASANA', RegNo: 'BST/2023/075', Department: 'Food Technology'},

{IndexNumber: '2181', FullName: 'Ms. R.M.C. SHALIKA', RegNo: 'BST/2023/076', Department: 'Food Technology'},

{IndexNumber: '2183', FullName: 'Ms. H.M.S.N. JAYASUNDARA', RegNo: 'BST/2023/078', Department: 'Food Technology'},

{IndexNumber: '2185', FullName: 'Ms. T.F. SHAHITHA', RegNo: 'BST/2023/080', Department: 'Food Technology'},

{IndexNumber: '2188', FullName: 'Ms. R.F. RIMASHA', RegNo: 'BST/2023/083', Department: 'Food Technology'},

{IndexNumber: '2191', FullName: 'Mr. E.D. KAWSHALYA', RegNo: 'BST/2023/087', Department: 'Food Technology'},

{IndexNumber: '2194', FullName: 'Mr. K.M.C. UMED', RegNo: 'BST/2023/090', Department: 'Food Technology'},

{IndexNumber: '2196', FullName: 'Ms. P.L.D.S. DISSANAYAKE', RegNo: 'BST/2023/092', Department: 'Food Technology'},

{IndexNumber: '2198', FullName: 'Ms. A.N. HAFSA', RegNo: 'BST/2023/094', Department: 'Food Technology'},

{IndexNumber: '2202', FullName: 'Ms. M.N.F. NISMA', RegNo: 'BST/2023/098', Department: 'Food Technology'},

{IndexNumber: '2207', FullName: 'Mr. H.A.H.V.V. RODRIGO', RegNo: 'BST/2023/103', Department: 'Food Technology'},

{IndexNumber: '2458', FullName: 'Ms. D.D.N.A. RATHNAYAKE', RegNo: 'BST/2023/107', Department: 'Food Technology'},
{IndexNumber: '2211', FullName: 'Ms. P.K. SAMARANAYAKA', RegNo: 'ENT/2023/003', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2212', FullName: 'Mr. M.S.K. HIRUSHAN', RegNo: 'ΕΝΤ/2023/004', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2213', FullName: 'Mr. H.A.H.C. SENARATH', RegNo: 'ENT/2023/006', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2217', FullName: 'Mr. K.G.O. DHANANJAYA', RegNo: 'ΕΝΤ/2023/010', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2219', FullName: 'Mr. P.D.P. MIHIRANGA', RegNo: 'ENT/2023/012', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2220', FullName: 'Mr. H.G.C.G. ADITHYA', RegNo: 'ΕΝΤ/2023/013', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2221', FullName: 'Mr. K.V.H AROSHAN', RegNo: 'ΕΝΤ/2023/014', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2223', FullName: 'Mr. A.P.I. MADUSHAN', RegNo: 'ΕΝΤ/2023/016', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2224', FullName: 'Mr. M.P. MADUSHAN', RegNo: 'ΕΝΤ/2023/017', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2225', FullName: 'Mr. B.P.I. DILSHAN', RegNo: 'ΕΝΤ/2023/018', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2227', FullName: 'Mr. Β.Ν.Κ. MALSHAN', RegNo: 'ENT/2023/020', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2228', FullName: 'Mr. Κ.Α.Ν. DILANKA', RegNo: 'ENT/2023/021', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2232', FullName: 'Mr. S.W.R.U.S. AKWATHTHA', RegNo: 'ENT/2023/025', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2234', FullName: 'Mr. M.D. KAWSHAL', RegNo: 'ENT/2023/027', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2237', FullName: 'Mr. B.M.S.L. BAMUNUSINGHA', RegNo: 'ΕΝΤ/2023/030', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2239', FullName: 'Mr. H.P.S.P. MADURANGA', RegNo: 'ΕΝΤ/2023/032', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2241', FullName: 'Ms. M.W.P.Y.M. WIJESINGHE', RegNo: 'ΕΝΤ/2023/034', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2242', FullName: 'Mr. Y. LOSHAN', RegNo: 'ΕΝΤ/2023/035', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2245', FullName: 'Mr. R.B.M.N. BANDARA', RegNo: 'ΕΝΤ/2023/038', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2246', FullName: 'Mr. S.M.S.R. RATNAYAKE', RegNo: 'ENT/2023/039', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2248', FullName: 'Mr. R.B.S.A. SAMARAKOON', RegNo: 'ENT/2023/041', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2254', FullName: 'Mr. Y.P.G.S.T. RAJAPAKSHA', RegNo: 'ΕΝΤ/2023/047', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2258', FullName: 'Mr. S.P.M.M.U. PATHIRAJA', RegNo: 'ENT/2023/051', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2260', FullName: 'Mr. Κ.Μ.U.L.B. KULATHUNGA', RegNo: 'ΕΝΤ/2023/053', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2264', FullName: 'Mr. M.I.D. RANJITH', RegNo: 'ΕΝΤ/2023/057', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2265', FullName: 'Ms. M.G.L.S. MADAWALA', RegNo: 'ΕΝΤ/2023/058', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2267', FullName: 'Mr. U.D.P. NAVINDA', RegNo: 'ENT/2023/060', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2273', FullName: 'Ms. H.G.T.T. DHARMARATHNE', RegNo: 'ENT/2023/066', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2275', FullName: 'Mr. D.K.A. KANNANGARA', RegNo: 'ENT/2023/068', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2276', FullName: 'Ms. W.G.L.K. BANDARA', RegNo: 'ENT/2023/069', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2277', FullName: 'Mr. K.G.S.P. KODITHUWAKKU', RegNo: 'ENT/2023/070', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2279', FullName: 'Mr. A.G.Κ.Μ.Ι. MADUSHAN', RegNo: 'ΕΝΤ/2023/073', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2283', FullName: 'Mr. E.S. DULANJANA', RegNo: 'ΕΝΤ/2023/077', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2286', FullName: 'Ms. D.M.K.B.G.E.H. DISANAYAKA', RegNo: 'ΕΝΤ/2023/080', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2289', FullName: 'Mr. M.G.K.D. JAYASUNDARA', RegNo: 'ΕΝΤ/2023/083', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2290', FullName: 'Mr. A.M. HAANIN', RegNo: 'ΕΝΤ/2023/084', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2291', FullName: 'Mr. U.M. NAFLOON', RegNo: 'ΕΝΤ/2023/085', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2294', FullName: 'Mr. R.R. AHAMED', RegNo: 'ΕΝΤ/2023/088', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2296', FullName: 'Mr. Μ.Μ.M. AYYASH', RegNo: 'ΕΝΤ/2023/090', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2299', FullName: 'Mr. M.H.M. SAKKEEL', RegNo: 'ΕΝΤ/2023/093', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2300', FullName: 'Mr. M.I.M. SAFAN', RegNo: 'ENT/2023/094', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2301', FullName: 'Ms. V. SUVARNITHA', RegNo: 'ENT/2023/095', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2304', FullName: 'Ms. W.I.R. WATHTHUHEWA', RegNo: 'ΕΝΤ/2023/098', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2305', FullName: 'Mr. U.R.M.C. DILSHAN', RegNo: 'ENT/2023/099', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2308', FullName: 'Mr. A. KAJAPRIYAN', RegNo: 'ΕΝΤ/2023/102', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2309', FullName: 'Ms. T. KIRUBAKARAN', RegNo: 'ENT/2023/103', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2311', FullName: 'Mr. U.J.S. RUWANTHA', RegNo: 'ENT/2023/106', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2316', FullName: 'Ms. G.D.C.S. MANDAKINI', RegNo: 'ΕΝΤ/2023/111', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2317', FullName: 'Mr. H.M.L.N. HERATH', RegNo: 'ΕΝΤ/2023/112', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2318', FullName: 'Mr. S.M.R.L. SOORIYASEKARA', RegNo: 'ΕΝΤ/2023/113', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2323', FullName: 'Ms. T.W.I. MADHUMALI', RegNo: 'ΕΝΤ/2023/118', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2326', FullName: 'Mr. H.P.R. DILSHAN', RegNo: 'ENT/2023/121', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2327', FullName: 'Mr. U.D.H.G. RANATHUNGA', RegNo: 'ΕΝΤ/2023/122', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2328', FullName: 'Mr. W.A.K. RAVINDU', RegNo: 'ENT/2023/123', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2329', FullName: 'Ms. Ν.Τ. KARUNAMUNI', RegNo: 'ΕΝΤ/2023/124', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2330', FullName: 'Mr. R.A.P.S. RUPASINGHE', RegNo: 'ΕΝΤ/2023/126', Department: 'Electrical and Electronics Technology'},

{IndexNumber: '2331', FullName: 'Mr. V.G. NETHTHIKUMARA', RegNo: 'ENT/2023/127', Department: 'Electrical and Electronics Technology'}
];
const MOCK_EVENTS = [];
const MOCK_TRANSACTIONS = [];

// Global Target Budget (Rs. 1,000,000)
const GLOBAL_BUDGET_TARGET = 1000000;

// Pagination Variables
let currentStudentsPage = 1;
const studentsPerPage = 8;
let filteredStudentsList = [];

/* -------------------------------------------------------------
 * INITIALIZATION & STORAGE
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Universal Mobile Viewport Height (vh) Fix
    const updateVH = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    updateVH();
    window.addEventListener('resize', updateVH);

    initDatabase();
    initEventListeners();
    renderApp();
    
    // Check if there's a cached admin session
    const cachedUser = localStorage.getItem('rt_user_session');
    if (cachedUser) {
        state.currentUser = JSON.parse(cachedUser);
        toggleAdminInterface(true);
        showToast(`Welcome back, ${state.currentUser.name}!`, 'success');
    } else {
        toggleAdminInterface(false);
    }

    document.getElementById('campusGate').classList.add('gate-hidden');

    // Dismiss Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Minimum delay to show the beautiful animation
        setTimeout(() => {
            preloader.classList.add('fade-out');
            // Remove from DOM after transition
            setTimeout(() => {
                preloader.remove();
            }, 800);
        }, 1500);
    }
});

function initDatabase() {
    const storedStudents = localStorage.getItem('rt_students');
    if (storedStudents) {
        state.students = JSON.parse(storedStudents);
    } else {
        state.students = MOCK_STUDENTS.map(s => ({
            ...s,
            AmountPaid: 0,
            AmountOwed: 0,
            Status: 'Unpaid',
            monthlyPayments: MONTHS.reduce((acc, month) => ({ ...acc, [month]: false }), {})
        }));
    }
    
    // Safety check: ensure all students have the monthlyPayments object
    state.students.forEach(s => {
        if (!s.monthlyPayments) {
            s.monthlyPayments = MONTHS.reduce((acc, month) => ({ ...acc, [month]: false }), {});
        }
    });

    const storedEvents = localStorage.getItem('rt_events');
    state.events = storedEvents ? JSON.parse(storedEvents) : [...MOCK_EVENTS];

    const storedTransactions = localStorage.getItem('rt_transactions');
    state.transactions = storedTransactions ? JSON.parse(storedTransactions) : [...MOCK_TRANSACTIONS];

    saveToLocalStorage();
    filteredStudentsList = [...state.students];
}

function saveToLocalStorage() {
    localStorage.setItem('rt_students', JSON.stringify(state.students));
    localStorage.setItem('rt_events', JSON.stringify(state.events));
    localStorage.setItem('rt_transactions', JSON.stringify(state.transactions));
}

/* -------------------------------------------------------------
 * EVENT LISTENERS SETUP
 * ------------------------------------------------------------- */
function initEventListeners() {
    // Sidebar toggle (Responsive Hamburger)
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // SPA Routing (Tab Switching)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.getAttribute('data-view');
            switchView(viewName);
            // Auto-close sidebar on mobile
            document.getElementById('sidebar').classList.remove('open');
        });
    });

    // Link triggers
    const linkToEvents = document.getElementById('linkToEvents');
    if (linkToEvents) {
        linkToEvents.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('events');
        });
    }
    const linkToTransactions = document.getElementById('linkToTransactions');
    if (linkToTransactions) {
        linkToTransactions.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('transactions');
        });
    }

    document.getElementById('dashboardEventSelect').addEventListener('change', (e) => {
        state.dashboardEventId = e.target.value;
        renderDashboardStats();
        renderDashboardRecentTransactions();
    });

    // Modal Control: Generic Closer
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Modal overlays closer when clicking outside content
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });

    // Trigger Admin Login Modal
    document.getElementById('btnLoginLogout').addEventListener('click', () => {
        if (state.currentUser) {
            // Log Out
            state.currentUser = null;
            localStorage.removeItem('rt_user_session');
            toggleAdminInterface(false);
            showToast('Logged out successfully.', 'info');
        } else {
            // Open Login
            openModal('modalLogin');
        }
    });

    // Handle Login Form Submission
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Trigger Student Status Modal
    document.getElementById('btnStudentPortal').addEventListener('click', () => {
        document.getElementById('studentQueryResult').classList.add('hidden');
        document.getElementById('studentQueryEmpty').classList.remove('hidden');
        document.getElementById('studentSearchIndex').value = '';
        openModal('modalStudentPortal');
    });

    // Handle Student Index Query
    document.getElementById('btnQueryStudentStatus').addEventListener('click', queryStudentStatus);
    document.getElementById('studentSearchIndex').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') queryStudentStatus();
    });

    // Request Receipt Action
    document.getElementById('btnRequestReceipt').addEventListener('click', () => {
        showToast('Receipt PDF compilation initiated... Download will start shortly.', 'success');
        closeAllModals();
    });

    // Trigger Add Payment Modal
    const btnQuickAddPayment = document.getElementById('btnQuickAddPayment');
    if (btnQuickAddPayment) {
        btnQuickAddPayment.addEventListener('click', () => {
            populateSelectors();
            openModal('modalAddPayment');
        });
    }
    const btnCreateTransaction = document.getElementById('btnCreateTransaction');
    if (btnCreateTransaction) {
        btnCreateTransaction.addEventListener('click', () => {
            populateSelectors();
            openModal('modalAddPayment');
        });
    }

    // Add Student Form (Admin)
    const addStudentBtn = document.getElementById('btnOpenAddStudent');
    if (addStudentBtn) addStudentBtn.addEventListener('click', () => openModal('modalAddStudent'));
    
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) addStudentForm.addEventListener('submit', handleAddStudent);

    // Edit Student Form (Admin)
    const editForm = document.getElementById('editStudentForm');
    if (editForm) editForm.addEventListener('submit', handleEditStudent);

    // Record Payment Form Submit
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddPayment();
    });

    // Trigger New Event Modal
    document.getElementById('btnAddNewEvent').addEventListener('click', () => {
        openModal('modalNewEvent');
    });

    // Create Event Form Submit
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleNewEvent();
    });

    // Exports Triggers
    const btnExportStudents = document.getElementById('btnExportStudents');
    if (btnExportStudents) btnExportStudents.addEventListener('click', () => openModal('modalExport'));
    const btnExportTransactions = document.getElementById('btnExportTransactions');
    if (btnExportTransactions) btnExportTransactions.addEventListener('click', () => openModal('modalExport'));
    const btnExportPDFAction = document.getElementById('btnExportPDFAction');
    if (btnExportPDFAction) btnExportPDFAction.addEventListener('click', () => triggerExport('PDF'));
    const btnExportCSVAction = document.getElementById('btnExportCSVAction');
    if (btnExportCSVAction) btnExportCSVAction.addEventListener('click', () => triggerExport('CSV'));

    // Student Filter Actions
    const searchStudentInput = document.getElementById('searchStudentInput');
    if (searchStudentInput) searchStudentInput.addEventListener('input', applyStudentFilters);
    const filterEventSelect = document.getElementById('filterEventSelect');
    if (filterEventSelect) filterEventSelect.addEventListener('change', applyStudentFilters);
    const filterDeptSelect = document.getElementById('filterDeptSelect');
    if (filterDeptSelect) {
        filterDeptSelect.addEventListener('change', applyStudentFilters);
    }
    document.getElementById('filterStatusSelect').addEventListener('change', applyStudentFilters);

    // Pagination Click Actions
    const btnPrevPage = document.getElementById('btnPrevPage');
    if (btnPrevPage) btnPrevPage.addEventListener('click', () => {
        if (currentStudentsPage > 1) {
            currentStudentsPage--;
            renderStudentsTable();
        }
    });
    const btnNextPage = document.getElementById('btnNextPage');
    if (btnNextPage) btnNextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredStudentsList.length / studentsPerPage);
        if (currentStudentsPage < totalPages) {
            currentStudentsPage++;
            renderStudentsTable();
        }
    });

    // Transactions Search & Filters (detached since Transactions view removed)
    const searchTransactionInput = document.getElementById('searchTransactionInput');
    if (searchTransactionInput) searchTransactionInput.addEventListener('input', () => { /* transactions view removed */ });
    const filterPaymentMethod = document.getElementById('filterPaymentMethod');
    if (filterPaymentMethod) filterPaymentMethod.addEventListener('change', () => { /* transactions view removed */ });

    const searchMonthlyInput = document.getElementById('searchMonthlyInput');
    if (searchMonthlyInput) searchMonthlyInput.addEventListener('input', renderMonthlyView);

    // Campus Gate Verification Listeners
    document.getElementById('btnVerifyGate').addEventListener('click', verifyCampusGate);
    document.getElementById('gateStudentIndex').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyCampusGate();
    });
    document.getElementById('btnAdminAccessLink').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('modalLogin');
    });
}

/* -------------------------------------------------------------
 * SPA ROUTER
 * ------------------------------------------------------------- */
function switchView(viewName) {
    // 1. Update Navigation classes
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2. Hide all view panels
    const views = document.querySelectorAll('.view-panel');
    views.forEach(view => {
        view.classList.add('hidden');
    });

    // 3. Show target view panel
    const targetView = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // 4. Update Header Title
    document.getElementById('currentViewTitle').innerText = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    // 5. Toggle visibility of payment actions: Add Payment should appear only on Students view
    const quickAddBtn = document.getElementById('btnQuickAddPayment');
    const createTxnBtn = document.getElementById('btnCreateTransaction');
    if (quickAddBtn) {
        if (viewName === 'students') {
            quickAddBtn.style.display = '';
        } else {
            quickAddBtn.style.display = 'none';
        }
    }
    if (createTxnBtn) {
        if (viewName === 'transactions') {
            createTxnBtn.style.display = '';
        } else {
            createTxnBtn.style.display = 'none';
        }
    }

    // 6. Re-render specific chart triggers on report page opening
    if (viewName === 'reports') {
        setTimeout(renderReportCharts, 100);
    }
}

/* -------------------------------------------------------------
 * RENDER CONTROLLERS
 * ------------------------------------------------------------- */
function renderApp() {
    populateDashboardEventSelector();
    renderDashboardStats();
    renderEventsGrid();
    populateStudentEventSelector();
    renderMonthlyView(); // New view
    
    // Set student filter defaults & render
    applyStudentFilters();
    // Transactions view removed; full ledger rendering disabled here.
}

// Populate Event selector shown on Students view filters
function populateStudentEventSelector() {
    const sel = document.getElementById('filterEventSelect');
    if (!sel) return;
    sel.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = 'All';
    optAll.innerText = 'All Events';
    sel.appendChild(optAll);

    state.events.forEach(ev => {
        const o = document.createElement('option');
        o.value = ev.title;
        o.innerText = ev.title;
        sel.appendChild(o);
    });
}

// 1. DASHBOARD PORTLET
function populateDashboardEventSelector() {
    const eventSelect = document.getElementById('dashboardEventSelect');
    if (!eventSelect) return;

    eventSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.innerText = 'Select an event';
    eventSelect.appendChild(placeholderOption);

    if (state.events.length === 0) {
        eventSelect.disabled = true;
        state.dashboardEventId = null;
        return;
    }

    eventSelect.disabled = false;

    state.events.forEach(event => {
        const opt = document.createElement('option');
        opt.value = event.id;
        opt.innerText = event.title;
        eventSelect.appendChild(opt);
    });

    if (!state.dashboardEventId || !state.events.some(event => event.id === state.dashboardEventId)) {
        state.dashboardEventId = state.events[0].id;
    }

    eventSelect.value = state.dashboardEventId;
}

function getSelectedDashboardEvent() {
    return state.events.find(event => event.id === state.dashboardEventId) || state.events[0] || null;
}

// Security Helper: Check if user has edit permissions
function isAuthorizedEditor() {
    return state.currentUser && (['Treasurer', 'President', 'Admin'].includes(state.currentUser.role));
}

// Security Helper: Check if user is an ENT admin (allowed to delete events)
function isEntAdmin() {
    return state.currentUser && state.currentUser.email.toLowerCase().startsWith('ent');
}

function renderDashboardStats() {
    const selectedEvent = getSelectedDashboardEvent();
    const totalCollected = selectedEvent ? selectedEvent.collected : 0;
    const targetAmount = selectedEvent ? selectedEvent.target : 0;
    const collectionPercent = targetAmount > 0 ? Math.min(100, Math.round((totalCollected / targetAmount) * 100)) : 0;

    document.getElementById('statTotalFunds').innerText = `Rs. ${totalCollected.toLocaleString()}`;
    document.getElementById('legendCollectedVal').innerText = `Rs. ${totalCollected.toLocaleString()}`;

    const targetDeficit = Math.max(0, targetAmount - totalCollected);
    document.getElementById('statPendingDues').innerText = `Rs. ${targetDeficit.toLocaleString()}`;
    document.getElementById('legendPendingVal').innerText = `Rs. ${targetDeficit.toLocaleString()}`;

    document.getElementById('dashboardProgressPercent').innerText = `${collectionPercent}%`;
    document.getElementById('statTotalTarget').innerText = selectedEvent
        ? `Target: Rs. ${targetAmount.toLocaleString()} • ${selectedEvent.title}`
        : 'Target: Rs. 0';
    const selectedEventLabel = document.getElementById('dashboardSelectedEventLabel');
    if (selectedEventLabel) {
        selectedEventLabel.innerText = selectedEvent
            ? selectedEvent.title
            : 'Select an event to view its payment totals';
    }

    // SVGCircle progress ring dash offset calibration
    // Radius is 90, Circumference = 2 * PI * R = ~565.48
    const strokeDashOffset = 565.48 - (collectionPercent / 100) * 565.48;
    document.getElementById('dashboardProgressRing').style.strokeDashoffset = strokeDashOffset;

    // Student counts
    const totalStudents = state.students.length;
    document.getElementById('statTotalStudents').innerText = totalStudents;

    const contributingCount = state.students.filter(s => Number(s.AmountPaid || 0) > 0).length;
    const contributorRatio = totalStudents > 0 ? Math.round((contributingCount / totalStudents) * 100) : 0;
    document.getElementById('statPaidPercent').innerText = `${contributorRatio}% Contributor Ratio`;

    const paidFullyCount = state.students.filter(s => s.Status === 'Paid').length;
    document.getElementById('statPaidCount').innerText = `${paidFullyCount} Students Paid Fully`;

    // Active Events
    const activeEventsCount = state.events.filter(e => e.active).length;
    document.getElementById('statActiveEvents').innerText = activeEventsCount;
    document.getElementById('statCompletedEvents').innerText = `${state.events.filter(e => !e.active).length} Completed Events`;
}



// 2. EVENTS DASHBOARD GRID
function renderEventsGrid() {
    const container = document.getElementById('eventsGridContainer');
    container.innerHTML = '';

    if (state.events.length === 0) {
        container.innerHTML = '<div class="content-card full-width text-center text-muted">No events constructed.</div>';
        return;
    }

    state.events.forEach(event => {
        const pct = event.target > 0 ? Math.round((event.collected / event.target) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'event-card';

        // Only ENT Admins can see the delete button for events
        const deleteBtn = isEntAdmin() 
            ? `<button class="btn btn-glass btn-arrow text-rose" style="position:absolute; top:1rem; right:1rem; z-index:10;" onclick="deleteEvent('${event.id}')" title="Delete Event Data">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
               </button>`
            : '';

        card.innerHTML = `
            ${deleteBtn}
            <div class="event-card-stripe" style="background-color: ${event.color}; box-shadow: 0 0 10px ${event.color};"></div>
            <div class="event-card-body">
                <h4 class="event-card-title">${event.title}</h4>
                <div class="event-card-meta">
                    <span>Deadline: ${event.deadline}</span>
                    <span class="badge badge-accent" style="color: ${event.color}; border-color: ${event.color}60;">${event.active ? 'Active' : 'Archived'}</span>
                </div>
                <div class="event-card-progress">
                    <div class="event-progress-details margin-bottom-sm">
                        <span class="text-xs text-muted">Progress Rate</span>
                        <span class="font-bold text-sm" style="color: ${event.color}">${pct}%</span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${event.color};"></div>
                    </div>
                </div>
                <div class="event-card-grid-metrics">
                    <div>
                        <span class="event-metric-lbl">Target Target</span>
                        <div class="event-metric-val">Rs. ${event.target.toLocaleString()}</div>
                    </div>
                    <div>
                        <span class="event-metric-lbl">Amount Collected</span>
                        <div class="event-metric-val text-emerald">Rs. ${event.collected.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

window.deleteEvent = function(eventId) {
    if (!isEntAdmin()) {
        showToast('Only ENT Admins are authorized to delete events!', 'error');
        return;
    }

    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    if (confirm(`CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE "${event.title}"? \n\nThis will: \n1. Remove the event \n2. Void ALL payments associated with it \n3. Revert student balance records \n\nThis cannot be undone.`)) {
        
        // 1. Identify all transactions for this event
        const txnsToVoid = state.transactions.filter(t => t.eventName === event.title);
        
        // 2. Revert student balances for each transaction
        txnsToVoid.forEach(txn => {
            const student = state.students.find(s => s.IndexNumber === txn.studentIndex);
            if (student) {
                student.AmountPaid = Math.max(0, (Number(student.AmountPaid) || 0) - (Number(txn.amount) || 0));
                student.AmountOwed = (Number(student.AmountOwed) || 0) + (Number(txn.amount) || 0);
                
                // Recalculate status
                if (student.AmountPaid === 0) student.Status = 'Unpaid';
                else if (student.AmountOwed <= 0) student.Status = 'Paid';
                else student.Status = 'Partially Paid';
            }
        });

        // 3. Remove transactions from ledger
        state.transactions = state.transactions.filter(t => t.eventName !== event.title);

        // 4. Remove the event
        state.events = state.events.filter(e => e.id !== eventId);

        // 5. Update dashboard selection if it was the deleted event
        if (state.dashboardEventId === eventId) {
            state.dashboardEventId = state.events.length > 0 ? state.events[0].id : null;
        }

        saveToLocalStorage();
        renderApp();
        showToast(`Event "${event.title}" and its records deleted successfully.`, 'info');
    }
};

// 3. STUDENT REGISTRY CONTROLLER
function applyStudentFilters() {
    const query = document.getElementById('searchStudentInput').value.toLowerCase().trim();
    const status = document.getElementById('filterStatusSelect').value;
    const selectedEvent = (document.getElementById('filterEventSelect') && document.getElementById('filterEventSelect').value) || 'All';

    filteredStudentsList = state.students.filter(student => {
        // Query text matches index number or student name
        const matchQuery = student.FullName.toLowerCase().includes(query) || student.IndexNumber.toLowerCase().includes(query);
        // Payment status match
        const matchStatus = (status === 'All') || (student.Status === status);
        // Event filter: if specific event selected, include only students who have payments for that event
        let matchEvent = true;
        if (selectedEvent && selectedEvent !== 'All') {
            matchEvent = state.transactions.some(t => t.studentIndex === student.IndexNumber && t.eventName === selectedEvent);
        }

        return matchQuery && matchStatus && matchEvent;
    });

    currentStudentsPage = 1; // Reset to page 1 on filter
    renderStudentsTable();
}

function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';
    // Render all filtered students and hide pagination controls (use vertical scroll)
    const totalStudents = filteredStudentsList.length;

    // Hide pagination UI entirely
    const paginationEl = document.querySelector('.pagination-container');
    if (paginationEl) paginationEl.style.display = 'none';

    // Update paging info: show total count
    document.getElementById('paginationInfo').innerText = totalStudents > 0
        ? `Showing 1 to ${totalStudents} of ${totalStudents} students`
        : `Showing 0 to 0 of 0 students`;

    // Clear page indicator controls (not used)
    const pageIndicator = document.getElementById('pageIndicator');
    if (pageIndicator) pageIndicator.innerText = '';

    if (totalStudents === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-muted text-center">No student records match selected filters.</td></tr>';
        return;
    }

    const pageStudents = filteredStudentsList.slice(0); // all filtered students

    pageStudents.forEach(student => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = 'badge-unpaid';
        if (student.Status === 'Paid') statusBadgeClass = 'badge-paid';
        else if (student.Status === 'Partially Paid') statusBadgeClass = 'badge-pending';
        // Set action columns only for authorized admin roles (Treasurer, President, or Admin)
        const isEditor = isAuthorizedEditor();
        const adminActionCol = isEditor 
            ? `<td class="admin-only">
                    <button class="btn btn-glass btn-arrow" onclick="quickAddPaymentForStudent('${student.IndexNumber}')" title="Record Payment">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <button class="btn btn-glass btn-arrow" onclick="openEditStudent('${student.IndexNumber}')" title="Edit Student">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </button>
                </td>` 
            : '';

        // Show editable inputs for paid/owed/status only to authorized editors
        const paidVal = (Number(student.AmountPaid) || 0);
        const owedVal = (Number(student.AmountOwed) || 0);

        const paidCell = isEditor
            ? `<td><input type="number" min="0" step="0.01" class="student-paid-input" data-index="${student.IndexNumber}" value="${paidVal}" onchange="inlineUpdateStudent('${student.IndexNumber}','AmountPaid', this.value)"></td>`
            : `<td class="text-emerald font-bold">Rs. ${paidVal.toLocaleString()}</td>`;

        const owedCell = isEditor
            ? `<td><input type="number" min="0" step="0.01" class="student-owed-input" data-index="${student.IndexNumber}" value="${owedVal}" onchange="inlineUpdateStudent('${student.IndexNumber}','AmountOwed', this.value)"></td>`
            : `<td class="text-muted">Rs. ${owedVal.toLocaleString()}</td>`;

        const statusCell = isEditor
            ? `<td>
                    <select onchange="inlineUpdateStudent('${student.IndexNumber}','Status', this.value)" class="form-control select-dark">
                        <option value="Unpaid" ${ (student.Status || 'Unpaid') === 'Unpaid' ? 'selected' : '' }>Unpaid</option>
                        <option value="Partially Paid" ${ (student.Status || '') === 'Partially Paid' ? 'selected' : '' }>Partially Paid</option>
                        <option value="Paid" ${ (student.Status || '') === 'Paid' ? 'selected' : '' }>Paid</option>
                    </select>
               </td>`
            : `<td><span class="badge ${statusBadgeClass}">${student.Status || 'Unpaid'}</span></td>`;

        tr.innerHTML = `
            <td class="font-bold text-cyan">${student.IndexNumber}</td>
            <td class="font-bold text-muted">${student.RegNo || ''}</td>
            <td class="font-bold text-white">${student.FullName}</td>
            ${paidCell}
            ${owedCell}
            <td>${student.Department}</td>
            ${statusCell}
            ${adminActionCol}
        `;
        tbody.appendChild(tr);
    });
}

// Transactions view removed: renderTransactionsTable() deleted.

// 5. REPORTS DASHBOARD CHARTS
function renderReportCharts() {
    const chartContainer = document.getElementById('deptBarChart');
    chartContainer.innerHTML = '';

    const totalCollected = state.students.reduce((sum, s) => sum + (Number(s.AmountPaid) || 0), 0);
    const facultyBarHeight = totalCollected > 0 ? 100 : 16;

    const barGroup = document.createElement('div');
    barGroup.className = 'chart-bar-group';
    barGroup.innerHTML = `
        <div class="chart-bar" style="height: ${facultyBarHeight}%;">
            <span class="chart-bar-value">Rs. ${totalCollected.toLocaleString()}</span>
        </div>
        <span class="chart-bar-label" title="Technology Faculty">Technology Faculty</span>
    `;
    chartContainer.appendChild(barGroup);

    // Update Report panel text stats
    document.getElementById('reportTopDept').innerText = 'Technology Faculty';
    document.getElementById('reportTopDeptStat').innerText = `Rs. ${totalCollected.toLocaleString()} collected`;

    const totalStudents = state.students.length;
    const avgContrib = totalStudents > 0 ? Math.round(totalCollected / totalStudents) : 0;
    document.getElementById('reportAvgContribution').innerText = `Rs. ${avgContrib.toLocaleString()}`;

    const totalDeficit = Math.max(0, GLOBAL_BUDGET_TARGET - totalCollected);
    document.getElementById('reportTotalDeficit').innerText = `Rs. ${totalDeficit.toLocaleString()}`;

    // Event contribution breakdown table
    const tableBody = document.getElementById('reportEventBreakdown');
    tableBody.innerHTML = '';

    if (state.events.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No events configured.</td></tr>';
        return;
    }

    state.events.forEach(event => {
        const rate = Math.round((event.collected / event.target) * 100);
        
        // Dynamic event payment contributors share
        const contributorsCount = state.transactions.filter(t => t.eventName === event.title).length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-bold text-white">${event.title}</td>
            <td>Rs. ${event.target.toLocaleString()}</td>
            <td class="text-emerald font-bold">Rs. ${event.collected.toLocaleString()}</td>
            <td>
                <span class="badge" style="background: rgba(0, 242, 254, 0.08); color: ${event.color}; border: 1px solid ${event.color}30;">
                    ${rate}% Complete
                </span>
            </td>
            <td class="text-muted">${contributorsCount} contributors</td>
        `;
        tableBody.appendChild(tr);
    });
}
/* -------------------------------------------------------------
 * MONTHLY FUND CONTROLLER
 * ------------------------------------------------------------- */
function renderMonthlyView() {
    const tableBody = document.getElementById('monthlyTableBody');
    const headerRow = document.getElementById('monthlyHeaderRow');
    if (!tableBody || !headerRow) return;

    // Build Header
    headerRow.innerHTML = '<th style="text-align: left; position: sticky; left: 0; background: var(--bg-card); z-index: 11;">Student Details</th>';
    MONTHS.forEach(month => {
        const th = document.createElement('th');
        th.innerText = month;
        headerRow.appendChild(th);
    });

    // Filter students
    const search = document.getElementById('searchMonthlyInput')?.value.toLowerCase() || '';
    const filtered = state.students.filter(s => 
        s.FullName.toLowerCase().includes(search) || 
        s.IndexNumber.toLowerCase().includes(search)
    );

    tableBody.innerHTML = '';
    filtered.forEach(student => {
        const tr = document.createElement('tr');
        
        let html = `
            <td style="text-align: left; position: sticky; left: 0; background: var(--bg-card); z-index: 10;">
                <div class="font-bold text-white">${student.FullName}</div>
                <div class="text-xs text-muted">${student.IndexNumber} • ${student.Department}</div>
            </td>
        `;

        MONTHS.forEach(month => {
            const isPaid = student.monthlyPayments[month];
            html += `
                <td class="month-cell" onclick="toggleMonthlyPayment('${student.IndexNumber}', '${month}')">
                    <div class="month-status ${isPaid ? 'paid' : ''}"></div>
                </td>
            `;
        });

        tr.innerHTML = html;
        tableBody.appendChild(tr);
    });
}

function toggleMonthlyPayment(indexNumber, month) {
    if (!state.currentUser) {
        showToast('Only authorized admins can modify payment records!', 'error');
        return;
    }

    const student = state.students.find(s => s.IndexNumber === indexNumber);
    if (student) {
        student.monthlyPayments[month] = !student.monthlyPayments[month];
        
        // Sync with transactions/stats if needed
        const amount = student.monthlyPayments[month] ? MONTHLY_FEE : -MONTHLY_FEE;
        
        // Update summary student metrics (optional, if we want monthly to count towards total)
        // For now, let's keep monthly separate or add to AmountPaid
        student.AmountPaid += amount;
        
        // Record as transaction
        if (student.monthlyPayments[month]) {
            const txn = {
                id: 'M-' + Date.now().toString().slice(-6),
                date: new Date().toISOString().split('T')[0],
                studentName: student.FullName,
                studentIndex: student.IndexNumber,
                eventName: `Monthly Fund (${month})`,
                amount: MONTHLY_FEE,
                method: 'Direct Toggle',
                status: 'Paid'
            };
            state.transactions.push(txn);
        } else {
            // Remove the transaction if untoggled (search and destroy)
            state.transactions = state.transactions.filter(t => 
                !(t.studentIndex === student.IndexNumber && t.eventName === `Monthly Fund (${month})`)
            );
        }

        saveToLocalStorage();
        renderMonthlyView();
        renderDashboardStats();
        showToast(`${student.FullName} - ${month} marked as ${student.monthlyPayments[month] ? 'Paid' : 'Unpaid'}`, 'success');
    }
}

/* -------------------------------------------------------------
 * ACTIONS & OPERATIONS HANDLERS
 * ------------------------------------------------------------- */

// AUTHENTICATION CONTROLLER
function handleLogin() {
    const email = document.getElementById('loginEmail').value.toLowerCase().trim();
    const password = document.getElementById('loginPassword').value;
    const errorAlert = document.getElementById('loginErrorAlert');
    const errorText = document.getElementById('loginErrorText');

    errorAlert.classList.add('hidden');

    // 1. Strict email domain restriction validator
    if (!email.endsWith(UNIVERSITY_DOMAIN)) {
        errorText.innerText = `Access denied! Only official ${UNIVERSITY_DOMAIN} emails are allowed.`;
        errorAlert.classList.remove('hidden');
        showToast('Invalid email domain.', 'error');
        return;
    }

    // 2. Validate email and password matches
    const verifiedAdmin = AUTHORIZED_ADMINS.find(admin => admin.email === email && admin.password === password);

    if (verifiedAdmin) {
        // Authenticated
        state.currentUser = {
            email: verifiedAdmin.email,
            role: verifiedAdmin.role,
            name: verifiedAdmin.name
        };
        localStorage.setItem('rt_user_session', JSON.stringify(state.currentUser));
        
        toggleAdminInterface(true);
        document.getElementById('campusGate').classList.add('gate-hidden');
        
        closeAllModals();
        showToast(`Authenticated successfully as ${verifiedAdmin.role}!`, 'success');
        
        // Reset login form fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        errorText.innerText = 'Invalid email address or access password credentials.';
        errorAlert.classList.remove('hidden');
        showToast('Authentication failed.', 'error');
    }
}

function toggleAdminInterface(isUnlocked) {
    const adminElements = document.querySelectorAll('.admin-only');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const loginBtnText = document.getElementById('loginBtnText');
    const btnLoginLogout = document.getElementById('btnLoginLogout');
    const profileCard = document.querySelector('.user-profile-card');

    if (isUnlocked && state.currentUser) {
        // Show all administrative elements
        adminElements.forEach(el => el.classList.remove('hidden'));
        
        // Update user footer card details
        profileAvatar.innerText = state.currentUser.role === 'Treasurer' ? 'S' : 'R';
        profileName.innerText = state.currentUser.role === 'Treasurer' ? 'Salinda' : 'Rasika';
        profileRole.innerText = `${state.currentUser.role} (Admin)`;
        profileCard.classList.add('admin-active');
        
        // Modify Header button
        loginBtnText.innerText = 'Log Out';
        btnLoginLogout.classList.add('admin-active');
    } else {
        // Hide all administrative elements
        adminElements.forEach(el => el.classList.add('hidden'));
        
        // Reset user footer card details to default guest
        profileAvatar.innerText = 'G';
        profileName.innerText = 'Public Guest';
        profileRole.innerText = 'Read Only';
        profileCard.classList.remove('admin-active');
        
        // Modify Header button
        loginBtnText.innerText = 'Sign in to Edit';
        btnLoginLogout.classList.remove('admin-active');
    }

    // Force student list to re-draw so column actions render
    renderStudentsTable();
}

// CAMPUS GATE VERIFICATION ENGINE
function verifyCampusGate() {
    const rawInput = document.getElementById('gateStudentIndex').value.trim();
    const errorAlert = document.getElementById('gateErrorAlert');
    const errorText = document.getElementById('gateErrorText');

    errorAlert.classList.add('hidden');

    if (!rawInput) {
        errorText.innerText = "Please enter your Campus Index Number or University Email!";
        errorAlert.classList.remove('hidden');
        showToast('Access field is empty.', 'warning');
        return;
    }

    const isEmail = rawInput.includes('@');
    let matchedStudent = null;

    if (isEmail) {
        const emailLower = rawInput.toLowerCase();
        // Only allow official university email domain
        if (!emailLower.endsWith('@tec.rjt.ac.lk')) {
            errorText.innerText = `Only official @tec.rjt.ac.lk emails are permitted. Got: "${rawInput}"`;
            errorAlert.classList.remove('hidden');
            showToast('Invalid email domain.', 'error');
            return;
        }
        // Derive index number from email prefix (e.g., tec2223001@tec.rjt.ac.lk → TEC2223001)
        const emailPrefix = emailLower.split('@')[0].toUpperCase();
        matchedStudent = state.students.find(s => s.IndexNumber.toUpperCase() === emailPrefix);
    } else {
        // Direct index number lookup
        const rawIndex = rawInput.toUpperCase();
        matchedStudent = state.students.find(s => s.IndexNumber.toUpperCase() === rawIndex);
    }

    if (matchedStudent) {
        // Verified! Save in sessionStorage
        sessionStorage.setItem('rt_campus_verified', 'true');
        sessionStorage.setItem('rt_verified_index', matchedStudent.IndexNumber);

        // Hide gate overlay with animation
        document.getElementById('campusGate').classList.add('gate-hidden');

        showToast(`Access Granted. Welcome, ${matchedStudent.FullName}!`, 'success');

        // Pre-fill student search with their index
        document.getElementById('searchStudentInput').value = matchedStudent.IndexNumber;
        applyStudentFilters();
    } else {
        errorText.innerText = isEmail
            ? `No student found for email "${rawInput}". Please verify your email with the batch treasurer.`
            : `Invalid Index Number "${rawInput.toUpperCase()}"! Please verify your ID with the batch treasurer.`;
        errorAlert.classList.remove('hidden');
        showToast('Verification failed. Unrecognized credentials.', 'error');
    }
}

// PUBLIC INDEX INQUIRY CONTROLLER
function queryStudentStatus() {
    const rawIndex = document.getElementById('studentSearchIndex').value.toUpperCase().trim();
    const resultCard = document.getElementById('studentQueryResult');
    const emptyResult = document.getElementById('studentQueryEmpty');

    if (!rawIndex) {
        showToast('Please specify a valid Student Index Number.', 'warning');
        return;
    }

    const student = state.students.find(s => s.IndexNumber.toUpperCase() === rawIndex);

    if (student) {
        emptyResult.classList.add('hidden');
        resultCard.classList.remove('hidden');

        document.getElementById('qStudentName').innerText = student.FullName;
        document.getElementById('qStudentIndexDept').innerText = `${student.IndexNumber} • Department of ${student.Department}`;
        const regEl = document.getElementById('qStudentRegNo');
        if (regEl) regEl.innerText = `Reg No: ${student.RegNo || '—'}`;
        
        // Status Badge styling
        const badge = document.getElementById('qStudentStatusBadge');
        badge.innerText = student.Status || 'Unpaid';
        badge.className = 'badge'; // clear previous
        if (student.Status === 'Paid') badge.classList.add('badge-paid');
        else if (student.Status === 'Partially Paid') badge.classList.add('badge-pending');
        else badge.classList.add('badge-unpaid');

        document.getElementById('qStudentPaid').innerText = `Rs. ${(Number(student.AmountPaid) || 0).toLocaleString()}`;
        document.getElementById('qStudentOwed').innerText = `Rs. ${(Number(student.AmountOwed) || 0).toLocaleString()}`;

        // Personal Timelines
        const timeline = document.getElementById('qStudentTimeline');
        timeline.innerHTML = '';

        const payments = state.transactions.filter(t => t.studentIndex === student.IndexNumber);

        if (payments.length === 0) {
            timeline.innerHTML = '<span class="text-xs text-muted">No transaction ledger recorded for this index.</span>';
        } else {
            // Group payments by event name
            const grouped = payments.reduce((acc, p) => {
                const key = p.eventName || 'Unassigned Event';
                if (!acc[key]) acc[key] = [];
                acc[key].push(p);
                return acc;
            }, {});

            // Convert to array with totals and sort by most recent payment date per event
            const events = Object.keys(grouped).map(name => {
                const list = grouped[name].slice().sort((a, b) => new Date(b.date) - new Date(a.date));
                const total = list.reduce((s, x) => s + (Number(x.amount) || 0), 0);
                return { name, list, total, latest: new Date(list[0].date) };
            }).sort((a, b) => b.latest - a.latest);

            // Render grouped event sections
            events.forEach(evt => {
                const section = document.createElement('div');
                section.className = 'timeline-event-section margin-bottom-md';
                section.innerHTML = `
                    <div class="timeline-event-header">
                        <strong>${evt.name}</strong>
                        <span class="text-muted"> — ${evt.list.length} payment(s)</span>
                        <span class="text-emerald font-bold" style="float:right">Rs. ${evt.total.toLocaleString()}</span>
                    </div>
                `;

                // Individual payments under event
                evt.list.forEach(p => {
                    const row = document.createElement('div');
                    row.className = 'timeline-row small muted';
                    row.innerHTML = `
                        <span class="text-xs">${p.date}</span>
                        <span class="text-emerald font-bold" style="float:right">Rs. ${Number(p.amount).toLocaleString()}</span>
                    `;
                    section.appendChild(row);
                });

                timeline.appendChild(section);
            });
        }
        showToast('Index details retrieved successfully.', 'success');
    } else {
        resultCard.classList.add('hidden');
        emptyResult.classList.remove('hidden');
        emptyResult.innerHTML = `
            <svg viewBox="0 0 24 24" class="empty-icon text-rose" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-sm text-rose font-bold">No record found matching Index Number "${rawIndex}".</p>
        `;
        showToast('No record matched that index.', 'error');
    }
}

// QUICK LINK ADMIN ASSISTANCE
window.quickAddPaymentForStudent = function(indexNumber) {
    // Only allow quick payment flow for Treasurer, President, or Admin
    if (!isAuthorizedEditor()) {
        showToast('Only authorized administrators can record payments.', 'error');
        return;
    }
    populateSelectors();
    document.getElementById('paymentStudentSelect').value = indexNumber;
    openModal('modalAddPayment');
};

// ADMIN: Open Edit Student modal and populate fields
window.openEditStudent = function(indexNumber) {
    // Only authorized roles may edit student payment fields
    if (!isAuthorizedEditor()) {
        showToast('Only authorized administrators may edit student records.', 'error');
        return;
    }
    const student = state.students.find(s => s.IndexNumber === indexNumber);
    if (!student) {
        showToast('Student record not found.', 'error');
        return;
    }

    document.getElementById('editIndexNumber').value = student.IndexNumber;
    document.getElementById('editRegNo').value = student.RegNo || '';
    document.getElementById('editFullName').value = student.FullName;
    document.getElementById('editAmountPaid').value = Number(student.AmountPaid || 0);
    document.getElementById('editAmountOwed').value = Number(student.AmountOwed || 0);
    document.getElementById('editStatusSelect').value = student.Status || 'Unpaid';

    openModal('modalEditStudent');
};

// ADMIN: Handle manual student registration
function handleAddStudent(e) {
    e.preventDefault();
    if (!isAuthorizedEditor()) {
        showToast('Unauthorized access!', 'error');
        return;
    }

    const indexNumber = document.getElementById('addIndexNumber').value.trim().toUpperCase();
    const fullName = document.getElementById('addFullName').value.trim();
    const regNo = document.getElementById('addRegNo').value.trim();
    const dept = document.getElementById('addDepartment').value;
    const paid = parseFloat(document.getElementById('addAmountPaid').value) || 0;
    const owed = parseFloat(document.getElementById('addAmountOwed').value) || 0;
    const status = document.getElementById('addStatusSelect').value;

    if (state.students.some(s => s.IndexNumber === indexNumber)) {
        showToast(`Student with Index ${indexNumber} already exists!`, 'warning');
        return;
    }

    const newStudent = {
        IndexNumber: indexNumber,
        FullName: fullName,
        RegNo: regNo,
        Department: dept,
        AmountPaid: paid,
        AmountOwed: owed,
        Status: status,
        monthlyPayments: MONTHS.reduce((acc, month) => ({ ...acc, [month]: false }), {})
    };

    state.students.push(newStudent);
    saveToLocalStorage();
    renderApp();
    closeAllModals();
    
    // Clear form
    e.target.reset();
    showToast(`Registered ${fullName} successfully.`, 'success');
}

// ADMIN: Handle edit student form submit
function handleEditStudent(e) {
    e.preventDefault();
    const idx = document.getElementById('editIndexNumber').value.trim();
    const paid = parseFloat(document.getElementById('editAmountPaid').value) || 0;
    const owed = parseFloat(document.getElementById('editAmountOwed').value) || 0;
    const status = document.getElementById('editStatusSelect').value;

    const student = state.students.find(s => s.IndexNumber === idx);
    if (!student) {
        showToast('Student not found.', 'error');
        return;
    }

    // Only authorized roles may persist payment changes
    if (!isAuthorizedEditor()) {
        showToast('You are not authorized to update payment information.', 'error');
        return;
    }

    student.AmountPaid = paid;
    student.AmountOwed = owed;
    student.Status = status;

    // Persist and refresh
    saveToLocalStorage();
    renderApp();
    closeAllModals();
    showToast(`Student ${student.IndexNumber} updated.`, 'success');
}

// Inline update handler used by table inputs/selects
window.inlineUpdateStudent = function(indexNumber, field, value) {
    // Only authorized admins may update
    if (!isAuthorizedEditor()) {
        showToast('Only authorized administrators may update this field.', 'error');
        // Optionally re-render to reset input
        renderStudentsTable();
        return;
    }

    const student = state.students.find(s => s.IndexNumber === indexNumber);
    if (!student) {
        showToast('Student not found.', 'error');
        return;
    }

    if (field === 'AmountPaid' || field === 'AmountOwed') {
        const num = Number(value) || 0;
        student[field] = num;
    } else if (field === 'Status') {
        student.Status = value;
    } else {
        student[field] = value;
    }

    // Persist and refresh summary visuals
    saveToLocalStorage();
    renderApp();
    showToast(`Updated ${indexNumber} ${field}.`, 'success');
};

// POPULATE DROPDOWNS SELECTORS
function populateSelectors() {
    const studentList = document.getElementById('studentList');
    const eventSelect = document.getElementById('paymentEventSelect');

    if (studentList) studentList.innerHTML = '';
    if (eventSelect) eventSelect.innerHTML = '';

    // Load registered students sorted by IndexNumber
    const sortedStudents = [...state.students].sort((a,b) => a.IndexNumber.localeCompare(b.IndexNumber));

    sortedStudents.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.IndexNumber;
        opt.innerText = `${s.IndexNumber} — ${s.FullName}`;
        if (studentList) studentList.appendChild(opt);
    });

    // Load active milestones events
    state.events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.innerText = e.title;
        if (eventSelect) eventSelect.appendChild(opt);
    });
}

// RECORD TRANSACTION ACTION
function handleAddPayment() {
    const index = document.getElementById('paymentStudentSelect').value;
    const eventId = document.getElementById('paymentEventSelect').value;
    const amt = parseFloat(document.getElementById('paymentAmount').value);
    const method = document.getElementById('paymentMethodSelect').value;

    if (!index || !eventId || isNaN(amt) || amt <= 0) {
        showToast('Please specify valid transaction details.', 'warning');
        return;
    }

    const student = state.students.find(s => s.IndexNumber === index);
    const event = state.events.find(e => e.id === eventId);

    if (!student || !event) {
        showToast('Record validation failure. Student/Event lost.', 'error');
        return;
    }

    // 1. Generate Audit Transaction Record
    const txnId = `TXN${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newTxn = {
        id: txnId,
        date: formattedDate,
        studentName: student.FullName,
        studentIndex: student.IndexNumber,
        eventName: event.title,
        method: method,
        amount: amt,
        status: 'Approved'
    };

    // 2. Push to Ledger
    state.transactions.push(newTxn);

    // 3. Increment Student Collections (create numeric fields if missing)
    student.AmountPaid = Number(student.AmountPaid) || 0;
    student.AmountOwed = Number(student.AmountOwed) || 0;

    student.AmountPaid += amt;
    student.AmountOwed = Math.max(0, student.AmountOwed - amt);

    // Status update: if no owed amount then Paid
    if (student.AmountOwed <= 0 && student.AmountPaid > 0) {
        student.Status = 'Paid';
        student.AmountOwed = 0;
    } else if (student.AmountPaid > 0) {
        student.Status = 'Partially Paid';
    } else {
        student.Status = 'Unpaid';
    }

    // 4. Increment Event Collections
    event.collected += amt;

    // 5. Commit to LocalStorage
    saveToLocalStorage();

    // 6. Refresh visuals
    renderApp();
    closeAllModals();

    // Reset inputs
    document.getElementById('paymentAmount').value = '';

    showToast(`Payment of Rs. ${amt.toLocaleString()} recorded successfully for ${student.FullName}!`, 'success');
}

// PUBLISH NEW EVENT ACCOMPLISHMENT
function handleNewEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const target = parseFloat(document.getElementById('eventTarget').value);
    const deadline = document.getElementById('eventDeadline').value;
    const accentColor = document.getElementById('eventColorSelect').value;

    if (!title || isNaN(target) || target <= 0 || !deadline) {
        showToast('Please fulfill all event configurations correctly.', 'warning');
        return;
    }

    const newEvent = {
        id: `ev${state.events.length + 1}`,
        title: title,
        target: target,
        collected: 0,
        deadline: deadline,
        color: accentColor,
        active: true
    };

    state.events.push(newEvent);
    saveToLocalStorage();

    state.dashboardEventId = newEvent.id;

    renderApp();
    closeAllModals();

    // Reset fields
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTarget').value = '';
    document.getElementById('eventDeadline').value = '';

    showToast(`New Milestone "${title}" published successfully!`, 'success');
}

// VOID / DELETE TRANSACTION (ADMIN HELP)
window.voidTransaction = function(txnId) {
    if (!state.currentUser) return;

    if (confirm(`Are you absolutely sure you want to void transaction ${txnId}? All associated student/event balances will be reverted.`)) {
        const txnIndex = state.transactions.findIndex(t => t.id === txnId);
        if (txnIndex === -1) return;

        const txn = state.transactions[txnIndex];

        // 1. Revert student totals
        const student = state.students.find(s => s.IndexNumber === txn.studentIndex);
        if (student) {
            student.AmountPaid = Math.max(0, (Number(student.AmountPaid) || 0) - txn.amount);
            student.AmountOwed = (Number(student.AmountOwed) || 0) + txn.amount;
            
            if (student.AmountPaid === 0) {
                student.Status = 'Unpaid';
            } else if (student.AmountOwed <= 0) {
                student.Status = 'Paid';
            } else {
                student.Status = 'Partially Paid';
            }
        }

        // 2. Revert event collections
        const event = state.events.find(e => e.title === txn.eventName);
        if (event) {
            event.collected = Math.max(0, event.collected - txn.amount);
        }

        // 3. Splice transaction
        state.transactions.splice(txnIndex, 1);

        saveToLocalStorage();
        renderApp();
        showToast(`Transaction ${txnId} voided successfully.`, 'info');
    }
};

// EXPORT TOCSV / PDF ACTIONS SIMULATOR
function triggerExport(format) {
    showToast(`Exporting data registry in ${format} format... Compiled file ready.`, 'success');
    closeAllModals();

    if (format === 'CSV') {
        // Build a simulated download
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "IndexNumber,FullName,Department,AmountPaid,AmountOwed,Status\n";
        
        state.students.forEach(s => {
            const paid = Number(s.AmountPaid) || 0;
            const owed = Number(s.AmountOwed) || 0;
            const status = s.Status || 'Unpaid';
            csvContent += `"${s.IndexNumber}","${s.FullName}","${s.Department}",${paid},${owed},"${status}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `RT_Funds_Students_Audit_22_23.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/* -------------------------------------------------------------
 * UI INTERACTIVE SYSTEM WINDOWS
 * ------------------------------------------------------------- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.classList.remove('open'));
    // Clear login warning alert
    document.getElementById('loginErrorAlert').classList.add('hidden');
}

// SLIDE-IN SYSTEM TOASTS NOTIFIER
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon selection
    let icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (type === 'success') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'warning') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }

    toast.innerHTML = `
        ${icon}
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Auto wipe toast after 4s
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
