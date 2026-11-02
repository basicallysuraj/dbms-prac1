const sql = (stage, heading, code) => ({ stage, heading, code })

const joinDepartmentCreate = `CREATE TABLE DEPARTMENT (
    DEPT_ID NUMBER(5),
    DEPT_NAME VARCHAR2(30) NOT NULL,
    CONSTRAINT PK_DEPARTMENT PRIMARY KEY (DEPT_ID)
);`

const joinStudentCreate = `CREATE TABLE STUDENT (
    ROLL_NO NUMBER(5),
    STUDENT_NAME VARCHAR2(30) NOT NULL,
    GENDER VARCHAR2(10),
    CITY VARCHAR2(30),
    MARKS NUMBER(5,2),
    DEPT_ID NUMBER(5),
    CONSTRAINT PK_STUDENT PRIMARY KEY (ROLL_NO),
    CONSTRAINT FK_STUDENT_DEPT
    FOREIGN KEY (DEPT_ID)
    REFERENCES DEPARTMENT(DEPT_ID)
);`

const joinDepartmentInsert = `INSERT INTO DEPARTMENT VALUES (10, 'Computer');
INSERT INTO DEPARTMENT VALUES (20, 'Information Technology');
INSERT INTO DEPARTMENT VALUES (30, 'Mechanical');
INSERT INTO DEPARTMENT VALUES (40, 'Civil');`

const joinStudentInsert = `INSERT INTO STUDENT VALUES (1, 'Suraj', 'Male', 'Pune', 85, 10);
INSERT INTO STUDENT VALUES (2, 'Asha', 'Female', 'Mumbai', 90, 10);
INSERT INTO STUDENT VALUES (3, 'Rahul', 'Male', 'Alibag', 78, 20);
INSERT INTO STUDENT VALUES (4, 'Priya', 'Female', 'Pune', 88, 20);
INSERT INTO STUDENT VALUES (5, 'Aman', 'Male', 'Panvel', 76, 30);
INSERT INTO STUDENT VALUES (6, 'Neha', 'Female', 'Pune', 92, NULL);`

const joinVerify = `DESC DEPARTMENT;
DESC STUDENT;

SELECT * FROM DEPARTMENT;
SELECT * FROM STUDENT;`

const joinCleanup = `DROP TABLE STUDENT CASCADE CONSTRAINTS;
DROP TABLE DEPARTMENT CASCADE CONSTRAINTS;`

const employeeCreate = `CREATE TABLE EMPLOYEE (
    EMP_ID NUMBER(5) PRIMARY KEY,
    EMP_NAME VARCHAR2(30),
    DEPT_ID NUMBER(5),
    SALARY NUMBER(10,2)
);`

const employeeInsertNine = `INSERT INTO EMPLOYEE VALUES (101, 'Aarav', 10, 55000);
INSERT INTO EMPLOYEE VALUES (102, 'Diya', 10, 45000);
INSERT INTO EMPLOYEE VALUES (103, 'Ishaan', 20, 60000);
INSERT INTO EMPLOYEE VALUES (104, 'Mira', 20, 35000);
INSERT INTO EMPLOYEE VALUES (105, 'Kabir', 30, 50000);
INSERT INTO EMPLOYEE VALUES (106, 'Anaya', 30, 40000);
INSERT INTO EMPLOYEE VALUES (107, 'TestDelete', 40, 20000);
INSERT INTO EMPLOYEE VALUES (108, 'Nikhil', 40, 30000);
INSERT INTO EMPLOYEE VALUES (109, 'Pooja', 40, 35000);`

const employeeInsertEight = `INSERT INTO EMPLOYEE VALUES (101, 'Aarav', 10, 55000);
INSERT INTO EMPLOYEE VALUES (102, 'Diya', 10, 48000);
INSERT INTO EMPLOYEE VALUES (103, 'Ishaan', 20, 60000);
INSERT INTO EMPLOYEE VALUES (104, 'Mira', 20, 35000);
INSERT INTO EMPLOYEE VALUES (105, 'Kabir', 30, 50000);
INSERT INTO EMPLOYEE VALUES (106, 'Anaya', 30, 40000);
INSERT INTO EMPLOYEE VALUES (108, 'Nikhil', 40, 30000);
INSERT INTO EMPLOYEE VALUES (109, 'Pooja', 40, 35000);`

const employeeRows = [
  ['101', 'Aarav', '10', '55000'], ['102', 'Diya', '10', '48000'], ['103', 'Ishaan', '20', '60000'],
  ['104', 'Mira', '20', '35000'], ['105', 'Kabir', '30', '50000'], ['106', 'Anaya', '30', '40000'],
  ['108', 'Nikhil', '40', '30000'], ['109', 'Pooja', '40', '35000'],
]

const employeeCleanup = `DROP TABLE EMPLOYEE CASCADE CONSTRAINTS;`

const joinOutput = {
  columns: ['DEPT_ID', 'DEPT_NAME'],
  rows: [['10', 'Computer'], ['20', 'Information Technology'], ['30', 'Mechanical'], ['40', 'Civil']],
}

const studentOutput = {
  columns: ['ROLL_NO', 'STUDENT_NAME', 'GENDER', 'CITY', 'MARKS', 'DEPT_ID'],
  rows: [['1', 'Suraj', 'Male', 'Pune', '85', '10'], ['2', 'Asha', 'Female', 'Mumbai', '90', '10'], ['3', 'Rahul', 'Male', 'Alibag', '78', '20'], ['4', 'Priya', 'Female', 'Pune', '88', '20'], ['5', 'Aman', 'Male', 'Panvel', '76', '30'], ['6', 'Neha', 'Female', 'Pune', '92', 'NULL']],
}

const employeeOutput = { columns: ['EMP_ID', 'EMP_NAME', 'DEPT_ID', 'SALARY'], rows: employeeRows }

const practicals = [
  {
    id: 1,
    title: 'DDL Operations',
    shortTitle: 'DDL Operations',
    question: 'Create a STUDENT table with attributes Roll No., Student Name, Gender, City, Marks and Dept ID. Perform CREATE, ALTER, RENAME and DROP operations.',
    aim: 'To create a STUDENT table and perform the basic Data Definition Language operations supported by Oracle 10g.',
    dependency: 'Independent practical. The main sequence creates and finally drops STUDENT. Run the optional cleanup only when restarting after an interrupted attempt.',
    sections: [
      sql('setup', '01 · Create STUDENT table', `CREATE TABLE STUDENT (
    ROLL_NO NUMBER(5) PRIMARY KEY,
    STUDENT_NAME VARCHAR2(30),
    GENDER VARCHAR2(10),
    CITY VARCHAR2(30),
    MARKS NUMBER(5,2),
    DEPT_ID NUMBER(5)
);`),
      sql('verify', '02 · Verify the table structure', 'DESC STUDENT;'),
      sql('operation', '03 · ALTER TABLE operations', `ALTER TABLE STUDENT ADD (EMAIL VARCHAR2(50));

ALTER TABLE STUDENT
MODIFY (STUDENT_NAME VARCHAR2(50));

ALTER TABLE STUDENT DROP COLUMN EMAIL;`),
      sql('operation', '04 · RENAME the table and rename it back', `RENAME STUDENT TO STUDENT_TEMP;
RENAME STUDENT_TEMP TO STUDENT;`),
      sql('operation', '05 · DROP the table', 'DROP TABLE STUDENT;'),
      sql('cleanup', 'Optional · Cleanup before restarting', `BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE STUDENT CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN RAISE; END IF;
END;
/`),
    ],
    output: [
      { label: 'DESC STUDENT after CREATE', value: 'ROLL_NO NUMBER(5) NOT NULL · STUDENT_NAME VARCHAR2(30) · GENDER VARCHAR2(10) · CITY VARCHAR2(30) · MARKS NUMBER(5,2) · DEPT_ID NUMBER(5)' },
      { label: 'ALTER / RENAME / DROP result', value: 'Table altered successfully for each ALTER statement. STUDENT was renamed to STUDENT_TEMP and back. Table STUDENT dropped successfully.' },
    ],
    explanation: ['CREATE TABLE defines columns, data types, and the primary key.', 'ALTER TABLE ADD, MODIFY, and DROP COLUMN change an existing table definition.', 'RENAME changes an object name; DROP TABLE removes the table and its data.', 'DDL statements perform an implicit COMMIT in Oracle.'],
    result: 'The STUDENT table was created, inspected, altered, renamed, and dropped successfully.',
  },
  {
    id: 2,
    title: 'Primary Key and Foreign Key',
    shortTitle: 'Primary & Foreign Keys',
    question: 'Create STUDENT and DEPARTMENT tables using PRIMARY KEY and FOREIGN KEY constraints.',
    aim: 'To create related tables and enforce entity integrity with PRIMARY KEY and referential integrity with FOREIGN KEY constraints.',
    dependency: 'Independent practical. Creates both tables and inserts all records needed for the later JOIN demonstrations.',
    sections: [
      sql('setup', '01 · Create DEPARTMENT with a primary key', joinDepartmentCreate),
      sql('setup', '02 · Create STUDENT with primary and foreign keys', joinStudentCreate),
      sql('insert', '03 · Insert department records', joinDepartmentInsert),
      sql('insert', '04 · Insert student records', joinStudentInsert),
      sql('verify', '05 · Verify tables and records', joinVerify),
      sql('cleanup', 'Optional · Cleanup before restarting', joinCleanup),
    ],
    output: [
      { label: 'DEPARTMENT records', ...joinOutput },
      { label: 'STUDENT records', ...studentOutput },
    ],
    explanation: ['PK_DEPARTMENT and PK_STUDENT ensure that each department and student has a unique identifier.', 'FK_STUDENT_DEPT permits only department IDs that exist in DEPARTMENT; NULL is allowed for Neha because the foreign key is not NOT NULL.', 'Department 40 has no student, and student 6 has NULL DEPT_ID, so these records demonstrate outer joins.'],
    result: 'Both related tables were created with valid constraints, populated, and verified successfully.',
  },
  {
    id: 3,
    title: 'DML Operations',
    shortTitle: 'DML Operations',
    question: 'Create an EMPLOYEE table and perform INSERT, SELECT, UPDATE and DELETE operations on employee records.',
    aim: 'To perform INSERT, SELECT, UPDATE, and DELETE Data Manipulation Language operations on EMPLOYEE records.',
    dependency: 'Independent practical. It creates its own EMPLOYEE table and commits the final eight-row dataset.',
    sections: [
      sql('setup', '01 · Create EMPLOYEE table', employeeCreate),
      sql('verify', '02 · Verify table structure', 'DESC EMPLOYEE;'),
      sql('insert', '03 · Insert nine employee records', employeeInsertNine),
      sql('verify', '04 · Display all inserted records', 'SELECT * FROM EMPLOYEE ORDER BY EMP_ID;'),
      sql('operation', '05 · Update one salary and verify it', `UPDATE EMPLOYEE
SET SALARY = 48000
WHERE EMP_ID = 102;

SELECT * FROM EMPLOYEE
WHERE EMP_ID = 102;`),
      sql('operation', '06 · Delete one employee and verify deletion', `DELETE FROM EMPLOYEE
WHERE EMP_ID = 107;

SELECT * FROM EMPLOYEE ORDER BY EMP_ID;`),
      sql('operation', '07 · Commit the final transaction', 'COMMIT;'),
      sql('cleanup', 'Optional · Cleanup before restarting', employeeCleanup),
    ],
    output: [
      { label: 'After INSERT · 9 records', columns: employeeOutput.columns, rows: [['101', 'Aarav', '10', '55000'], ['102', 'Diya', '10', '45000'], ['103', 'Ishaan', '20', '60000'], ['104', 'Mira', '20', '35000'], ['105', 'Kabir', '30', '50000'], ['106', 'Anaya', '30', '40000'], ['107', 'TestDelete', '40', '20000'], ['108', 'Nikhil', '40', '30000'], ['109', 'Pooja', '40', '35000']] },
      { label: 'After UPDATE · EMP_ID 102', columns: employeeOutput.columns, rows: [['102', 'Diya', '10', '48000']] },
      { label: 'After DELETE and COMMIT · 8 records', ...employeeOutput },
    ],
    explanation: ['INSERT adds rows, SELECT displays rows, UPDATE changes rows matching its WHERE clause, and DELETE removes matching rows.', 'The WHERE clause is important because it limits UPDATE and DELETE to the intended record.', 'COMMIT permanently saves the final DML changes.'],
    result: 'Nine employees were inserted, Diya\'s salary was updated, TestDelete was removed, and the final eight-row table was committed.',
  },
  {
    id: 4,
    title: 'GRANT and REVOKE',
    shortTitle: 'GRANT & REVOKE',
    question: 'Demonstrate GRANT and REVOKE commands to provide and withdraw SELECT and INSERT privileges on a table.',
    aim: 'To grant and withdraw object privileges while understanding which Oracle account must execute each command.',
    dependency: 'Independent privilege practical. Replace the connection placeholders with valid credentials. Administrator permission is required for user creation.',
    sections: [
      sql('setup', '01 · As SYSTEM / administrator', `CONNECT SYSTEM;

CREATE USER TABLE_OWNER IDENTIFIED BY owner123;
GRANT CREATE SESSION, CREATE TABLE TO TABLE_OWNER;
ALTER USER TABLE_OWNER QUOTA UNLIMITED ON USERS;

CREATE USER LAB_USER IDENTIFIED BY lab123;
GRANT CREATE SESSION TO LAB_USER;`),
      sql('setup', '02 · As the table owner: create the sample table', `CONNECT TABLE_OWNER/owner123;

CREATE TABLE GRANT_TEST (
    TEST_ID NUMBER(5) PRIMARY KEY,
    TEST_NAME VARCHAR2(30)
);

INSERT INTO GRANT_TEST VALUES (1, 'Privilege Test');
COMMIT;`),
      sql('verify', '03 · As table owner: verify the owner table', `DESC GRANT_TEST;
SELECT * FROM GRANT_TEST;`),
      sql('operation', '04 · As table owner: GRANT privileges', `GRANT SELECT, INSERT ON GRANT_TEST TO LAB_USER;`),
      sql('operation', '05 · As LAB_USER: verify granted privileges', `CONNECT LAB_USER/lab123;

SELECT * FROM TABLE_OWNER.GRANT_TEST;

INSERT INTO TABLE_OWNER.GRANT_TEST
VALUES (2, 'Inserted by LAB_USER');

COMMIT;`),
      sql('operation', '06 · As table owner: REVOKE privileges', `CONNECT TABLE_OWNER/owner123;

REVOKE SELECT, INSERT ON GRANT_TEST FROM LAB_USER;`),
      sql('verify', '07 · As LAB_USER: verify revoked privileges', `CONNECT LAB_USER/lab123;

SELECT * FROM TABLE_OWNER.GRANT_TEST;
-- Expected: ORA-00942: table or view does not exist

INSERT INTO TABLE_OWNER.GRANT_TEST VALUES (3, 'Should Fail');
-- Expected: ORA-01031: insufficient privileges`),
      sql('cleanup', 'Optional · Cleanup as owner, then SYSTEM', `CONNECT TABLE_OWNER/owner123;
DROP TABLE GRANT_TEST CASCADE CONSTRAINTS;

CONNECT SYSTEM;
DROP USER LAB_USER CASCADE;
DROP USER TABLE_OWNER CASCADE;`),
    ],
    output: [
      { label: 'As LAB_USER after GRANT', columns: ['TEST_ID', 'TEST_NAME'], rows: [['1', 'Privilege Test'], ['2', 'Inserted by LAB_USER']] },
      { label: 'As LAB_USER after REVOKE', value: 'SELECT fails with ORA-00942 and INSERT fails with ORA-01031. This confirms that both object privileges were withdrawn.' },
    ],
    explanation: ['CREATE USER and GRANT CREATE SESSION require SYSTEM or another account with administrator privileges.', 'The table owner grants object privileges with GRANT and later removes them with REVOKE.', 'The LAB_USER connection must qualify the table with TABLE_OWNER.GRANT_TEST when the table is owned by another schema.'],
    result: 'SELECT and INSERT privileges were granted to LAB_USER, tested, revoked by the owner, and verified as unavailable.',
  },
  {
    id: 5,
    title: 'COMMIT and ROLLBACK',
    shortTitle: 'COMMIT & ROLLBACK',
    question: 'Demonstrate COMMIT and ROLLBACK commands using a BANK_ACCOUNT table to manage transactions.',
    aim: 'To demonstrate how COMMIT saves a transaction and ROLLBACK cancels changes made after the last commit.',
    dependency: 'Independent transaction practical. Creates its own BANK_ACCOUNT table.',
    sections: [
      sql('setup', '01 · Create BANK_ACCOUNT', `CREATE TABLE BANK_ACCOUNT (
    ACCOUNT_NO NUMBER(5) PRIMARY KEY,
    HOLDER_NAME VARCHAR2(30),
    BALANCE NUMBER(10,2)
);`),
      sql('insert', '02 · Insert two account records', `INSERT INTO BANK_ACCOUNT VALUES (1001, 'Suraj', 10000);
INSERT INTO BANK_ACCOUNT VALUES (1002, 'Amit', 5000);`),
      sql('verify', '03 · Display initial balances and commit', `SELECT * FROM BANK_ACCOUNT ORDER BY ACCOUNT_NO;

COMMIT;`),
      sql('operation', '04 · Transfer 1000 and inspect before COMMIT', `UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE - 1000
WHERE ACCOUNT_NO = 1001;

UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE + 1000
WHERE ACCOUNT_NO = 1002;

SELECT * FROM BANK_ACCOUNT ORDER BY ACCOUNT_NO;`),
      sql('operation', '05 · Commit the transfer', `COMMIT;
SELECT * FROM BANK_ACCOUNT ORDER BY ACCOUNT_NO;`),
      sql('operation', '06 · Make an uncommitted change, then ROLLBACK', `UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE - 500
WHERE ACCOUNT_NO = 1001;

SELECT * FROM BANK_ACCOUNT ORDER BY ACCOUNT_NO;

ROLLBACK;

SELECT * FROM BANK_ACCOUNT ORDER BY ACCOUNT_NO;`),
      sql('cleanup', 'Optional · Cleanup before restarting', 'DROP TABLE BANK_ACCOUNT CASCADE CONSTRAINTS;'),
    ],
    output: [
      { label: 'Initial balances after COMMIT', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '10000'], ['1002', 'Amit', '5000']] },
      { label: 'After transfer and second COMMIT', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '9000'], ['1002', 'Amit', '6000']] },
      { label: 'After -500 and ROLLBACK', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '9000'], ['1002', 'Amit', '6000']] },
    ],
    explanation: ['The first COMMIT saves the two inserted accounts.', 'The transfer changes both rows and the second COMMIT saves balances 9000 and 6000.', 'The later -500 update is uncommitted; ROLLBACK restores the last committed balances.'],
    result: 'The transfer was committed, and the later uncommitted withdrawal was correctly undone with ROLLBACK.',
  },
  {
    id: 6,
    title: 'Aggregate Functions',
    shortTitle: 'Aggregate Functions',
    question: 'Using the EMPLOYEE table, write SQL queries to find total employees, maximum salary, minimum salary, average salary and total salary expenditure.',
    aim: 'To calculate summary values with COUNT, MAX, MIN, AVG, and SUM in Oracle 10g.',
    dependency: 'Independent practical. It creates and populates its own eight-row EMPLOYEE table; it does not depend on Practical 3.',
    sections: [
      sql('setup', '01 · Create EMPLOYEE table', employeeCreate),
      sql('insert', '02 · Insert the complete eight-row dataset', employeeInsertEight),
      sql('verify', '03 · Verify table and records', `DESC EMPLOYEE;
SELECT * FROM EMPLOYEE ORDER BY EMP_ID;`),
      sql('operation', '04 · Execute individual aggregate queries', `SELECT COUNT(*) AS TOTAL_EMPLOYEES FROM EMPLOYEE;

SELECT MAX(SALARY) AS MAX_SALARY FROM EMPLOYEE;

SELECT MIN(SALARY) AS MIN_SALARY FROM EMPLOYEE;

SELECT AVG(SALARY) AS AVERAGE_SALARY FROM EMPLOYEE;

SELECT SUM(SALARY) AS TOTAL_SALARY FROM EMPLOYEE;`),
      sql('operation', '05 · Execute all calculations together', `SELECT
    COUNT(*) AS TOTAL_EMPLOYEES,
    MAX(SALARY) AS MAX_SALARY,
    MIN(SALARY) AS MIN_SALARY,
    AVG(SALARY) AS AVG_SALARY,
    SUM(SALARY) AS TOTAL_SALARY
FROM EMPLOYEE;`),
      sql('cleanup', 'Optional · Cleanup before restarting', employeeCleanup),
    ],
    output: [{ label: 'Calculated result from the eight inserted rows', columns: ['TOTAL_EMPLOYEES', 'MAX_SALARY', 'MIN_SALARY', 'AVG_SALARY', 'TOTAL_SALARY'], rows: [['8', '60000', '30000', '44125', '353000']] }],
    explanation: ['COUNT counts rows, MAX and MIN find the highest and lowest salary, AVG calculates the arithmetic mean, and SUM totals salary expenditure.', 'Oracle AVG returns a number; for this dataset the average is exactly 44125.', 'The values are calculated from the inserted rows, not manually inserted into the output.'],
    result: 'All five aggregate functions returned the expected summary for the independent eight-row EMPLOYEE dataset.',
  },
  {
    id: 7,
    title: 'GROUP BY and HAVING',
    shortTitle: 'GROUP BY & HAVING',
    question: 'Write SQL queries to display the number of employees in each department and identify departments whose average salary exceeds 40,000.',
    aim: 'To group employees by department and filter grouped results with the HAVING clause.',
    dependency: 'Independent practical. It creates its own EMPLOYEE table and inserts the complete eight-row dataset.',
    sections: [
      sql('setup', '01 · Create EMPLOYEE table', employeeCreate),
      sql('insert', '02 · Insert the complete eight-row dataset', employeeInsertEight),
      sql('verify', '03 · Display all employee records', `DESC EMPLOYEE;
SELECT * FROM EMPLOYEE ORDER BY EMP_ID;`),
      sql('operation', '04 · Count employees in each department', `SELECT
    DEPT_ID,
    COUNT(*) AS TOTAL_EMPLOYEES
FROM EMPLOYEE
GROUP BY DEPT_ID
ORDER BY DEPT_ID;`),
      sql('operation', '05 · Filter departments with HAVING', `SELECT
    DEPT_ID,
    AVG(SALARY) AS AVERAGE_SALARY
FROM EMPLOYEE
GROUP BY DEPT_ID
HAVING AVG(SALARY) > 40000
ORDER BY DEPT_ID;`),
      sql('cleanup', 'Optional · Cleanup before restarting', employeeCleanup),
    ],
    output: [
      { label: 'Employee count by department', columns: ['DEPT_ID', 'TOTAL_EMPLOYEES'], rows: [['10', '2'], ['20', '2'], ['30', '2'], ['40', '2']] },
      { label: 'Departments with average salary > 40000', columns: ['DEPT_ID', 'AVERAGE_SALARY'], rows: [['10', '51500'], ['20', '47500'], ['30', '45000']] },
    ],
    explanation: ['GROUP BY creates one group for each DEPT_ID before calculating the aggregate.', 'COUNT(*) counts records in every department.', 'HAVING filters groups after aggregation; departments 10, 20, and 30 exceed 40000, while department 40 averages 32500.'],
    result: 'The department counts and departments whose average salary exceeds 40000 were displayed correctly.',
  },
  {
    id: 8,
    title: 'STUDENT_A and STUDENT_B',
    shortTitle: 'STUDENT_A & STUDENT_B',
    question: 'Create two tables STUDENT_A and STUDENT_B containing student names.',
    aim: 'To create two student tables and demonstrate UNION, UNION ALL, INTERSECT, and MINUS set operations.',
    dependency: 'Independent practical. Creates and populates STUDENT_A and STUDENT_B.',
    sections: [
      sql('setup', '01 · Create both student tables', `CREATE TABLE STUDENT_A (
    STUDENT_NAME VARCHAR2(30)
);

CREATE TABLE STUDENT_B (
    STUDENT_NAME VARCHAR2(30)
);`),
      sql('insert', '02 · Insert sample records', `INSERT INTO STUDENT_A VALUES ('Suraj');
INSERT INTO STUDENT_A VALUES ('Asha');
INSERT INTO STUDENT_A VALUES ('Rahul');
INSERT INTO STUDENT_A VALUES ('Neha');

INSERT INTO STUDENT_B VALUES ('Rahul');
INSERT INTO STUDENT_B VALUES ('Neha');
INSERT INTO STUDENT_B VALUES ('Karan');
INSERT INTO STUDENT_B VALUES ('Priya');`),
      sql('verify', '03 · Verify both tables', `DESC STUDENT_A;
DESC STUDENT_B;

SELECT * FROM STUDENT_A ORDER BY STUDENT_NAME;
SELECT * FROM STUDENT_B ORDER BY STUDENT_NAME;`),
      sql('operation', '04 · Execute all four set operations', `SELECT STUDENT_NAME FROM STUDENT_A
UNION
SELECT STUDENT_NAME FROM STUDENT_B
ORDER BY STUDENT_NAME;

SELECT STUDENT_NAME FROM STUDENT_A
UNION ALL
SELECT STUDENT_NAME FROM STUDENT_B
ORDER BY STUDENT_NAME;

SELECT STUDENT_NAME FROM STUDENT_A
INTERSECT
SELECT STUDENT_NAME FROM STUDENT_B
ORDER BY STUDENT_NAME;

SELECT STUDENT_NAME FROM STUDENT_A
MINUS
SELECT STUDENT_NAME FROM STUDENT_B
ORDER BY STUDENT_NAME;`),
      sql('operation', '05 · Commit the inserts', 'COMMIT;'),
      sql('cleanup', 'Optional · Cleanup before restarting', `DROP TABLE STUDENT_A CASCADE CONSTRAINTS;
DROP TABLE STUDENT_B CASCADE CONSTRAINTS;`),
    ],
    output: [
      { label: 'UNION · distinct names', columns: ['STUDENT_NAME'], rows: [['Asha'], ['Karan'], ['Neha'], ['Priya'], ['Rahul'], ['Suraj']] },
      { label: 'UNION ALL · all eight rows', columns: ['STUDENT_NAME'], rows: [['Asha'], ['Karan'], ['Neha'], ['Neha'], ['Priya'], ['Rahul'], ['Rahul'], ['Suraj']] },
      { label: 'INTERSECT · common names', columns: ['STUDENT_NAME'], rows: [['Neha'], ['Rahul']] },
      { label: 'MINUS · names only in STUDENT_A', columns: ['STUDENT_NAME'], rows: [['Asha'], ['Suraj']] },
    ],
    explanation: ['UNION combines results and removes duplicates; UNION ALL keeps duplicates.', 'INTERSECT returns names present in both tables.', 'MINUS returns rows in the first query that do not occur in the second query.', 'Both SELECT statements in a set operation must return the same number and compatible types of columns.'],
    result: 'The two tables were created and all four Oracle set operations produced meaningful results.',
  },
  {
    id: 9,
    title: 'SQL String Functions',
    shortTitle: 'String Functions',
    question: 'Write SQL queries using UPPER(), LOWER(), INITCAP(), LENGTH(), SUBSTR(), INSTR(), CONCAT() and TRIM() to manipulate strings.',
    aim: 'To execute common Oracle string functions using the built-in DUAL table.',
    dependency: 'Independent practical. DUAL is an Oracle-provided one-row table used for expressions that do not need a user table.',
    sections: [
      sql('setup', '01 · Verify Oracle DUAL', `SELECT * FROM DUAL;`),
      sql('operation', '02 · Execute string function queries', `SELECT UPPER('suraj sahu') AS UPPER_NAME FROM DUAL;

SELECT LOWER('SURAJ SAHU') AS LOWER_NAME FROM DUAL;

SELECT INITCAP('suraj sahu') AS INITCAP_NAME FROM DUAL;

SELECT LENGTH('SURAJ') AS NAME_LENGTH FROM DUAL;

SELECT SUBSTR('SURAJ SAHU', 1, 5) AS NAME_PART FROM DUAL;

SELECT INSTR('SURAJ SAHU', 'A') AS A_POSITION FROM DUAL;

SELECT CONCAT('SURAJ', ' SAHU') AS FULL_NAME FROM DUAL;

SELECT TRIM(' ' FROM '  SURAJ SAHU  ') AS TRIMMED_NAME FROM DUAL;`),
      sql('cleanup', 'Optional · Cleanup note', '-- DUAL is an Oracle system table. No user-created table needs to be dropped.'),
    ],
    output: [{ label: 'Function results', columns: ['FUNCTION', 'OUTPUT', 'PURPOSE'], rows: [['UPPER()', 'SURAJ SAHU', 'Converts to uppercase'], ['LOWER()', 'suraj sahu', 'Converts to lowercase'], ['INITCAP()', 'Suraj Sahu', 'Capitalizes each word'], ['LENGTH()', '5', 'Counts characters'], ['SUBSTR()', 'SURAJ', 'Extracts characters 1 to 5'], ['INSTR()', '4', 'Finds first A position'], ['CONCAT()', 'SURAJ SAHU', 'Joins exactly two strings'], ['TRIM()', 'SURAJ SAHU', 'Removes surrounding spaces']] }],
    explanation: ['DUAL is an Oracle-maintained one-row, one-column table suitable for evaluating expressions.', 'UPPER, LOWER, and INITCAP change letter case; LENGTH counts characters.', 'SUBSTR extracts a portion of text, while INSTR returns the position of a search string.', 'Oracle CONCAT accepts exactly two arguments, and TRIM removes leading and trailing spaces.'],
    result: 'All eight Oracle string functions were executed through DUAL and returned the expected values.',
  },
  {
    id: 10,
    title: 'INNER JOIN',
    shortTitle: 'INNER JOIN',
    question: 'Create STUDENT and DEPARTMENT tables and display student names along with their respective department names using INNER JOIN.',
    aim: 'To create related tables from an empty schema and display only students with a matching department.',
    dependency: 'Independent practical. It creates and populates both tables before running the INNER JOIN.',
    sections: [
      sql('setup', '01 · Create DEPARTMENT', joinDepartmentCreate),
      sql('setup', '02 · Create STUDENT with constraints', joinStudentCreate),
      sql('insert', '03 · Insert complete department data', joinDepartmentInsert),
      sql('insert', '04 · Insert complete student data', joinStudentInsert),
      sql('verify', '05 · Verify both tables', joinVerify),
      sql('operation', '06 · Execute INNER JOIN', `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_NAME
FROM STUDENT S
INNER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;`),
      sql('cleanup', 'Optional · Cleanup before restarting', joinCleanup),
    ],
    output: [{ label: 'INNER JOIN output · matching rows only', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_NAME'], rows: [['1', 'Suraj', 'Computer'], ['2', 'Asha', 'Computer'], ['3', 'Rahul', 'Information Technology'], ['4', 'Priya', 'Information Technology'], ['5', 'Aman', 'Mechanical']] }],
    explanation: ['The tables and constraints are created before any join is attempted.', 'INNER JOIN returns only rows where S.DEPT_ID equals D.DEPT_ID.', 'Neha is excluded because her DEPT_ID is NULL, and Civil is excluded because it has no matching student.'],
    result: 'The independent setup ran successfully and the INNER JOIN displayed all five matching student-department rows.',
  },
  {
    id: 11,
    title: 'LEFT OUTER JOIN',
    shortTitle: 'LEFT OUTER JOIN',
    question: 'Write SQL queries to demonstrate LEFT OUTER JOIN.',
    aim: 'To create both tables independently and return every STUDENT row with matching department details where available.',
    dependency: 'Independent practical. Do not execute Practical 2 first; this page contains its own table creation and sample data.',
    sections: [
      sql('setup', '01 · Create DEPARTMENT', joinDepartmentCreate),
      sql('setup', '02 · Create STUDENT with constraints', joinStudentCreate),
      sql('insert', '03 · Insert four departments', joinDepartmentInsert),
      sql('insert', '04 · Insert six students', joinStudentInsert),
      sql('verify', '05 · Verify tables and records', joinVerify),
      sql('operation', '06 · Execute LEFT OUTER JOIN', `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
LEFT OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID
ORDER BY S.ROLL_NO;`),
      sql('cleanup', 'Optional · Cleanup before restarting', joinCleanup),
    ],
    output: [{ label: 'LEFT OUTER JOIN output · every student', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['6', 'Neha', 'NULL', 'NULL']] }],
    explanation: ['STUDENT is the left table, so every student is returned.', 'When no department matches, the department columns are NULL.', 'Neha is included because her NULL DEPT_ID does not remove her from the left-side result; unmatched department 40 is not shown.'],
    result: 'The independent tables were created and the LEFT OUTER JOIN returned every student, including Neha without a department.',
  },
  {
    id: 12,
    title: 'RIGHT OUTER JOIN',
    shortTitle: 'RIGHT OUTER JOIN',
    question: 'Write SQL queries to demonstrate RIGHT OUTER JOIN.',
    aim: 'To create both tables independently and return every DEPARTMENT row with matching student details where available.',
    dependency: 'Independent practical. The complete DEPARTMENT and STUDENT setup is included on this page.',
    sections: [
      sql('setup', '01 · Create DEPARTMENT', joinDepartmentCreate),
      sql('setup', '02 · Create STUDENT with constraints', joinStudentCreate),
      sql('insert', '03 · Insert four departments', joinDepartmentInsert),
      sql('insert', '04 · Insert six students', joinStudentInsert),
      sql('verify', '05 · Verify tables and records', joinVerify),
      sql('operation', '06 · Execute RIGHT OUTER JOIN', `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
RIGHT OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;`),
      sql('cleanup', 'Optional · Cleanup before restarting', joinCleanup),
    ],
    output: [{ label: 'RIGHT OUTER JOIN output · every department', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['NULL', 'NULL', '40', 'Civil']] }],
    explanation: ['DEPARTMENT is the right table, so every department is returned.', 'Civil has no matching student, therefore the student columns are NULL for department 40.', 'Neha is not a separate right-side unmatched row because her NULL department has no department match.'],
    result: 'The independent setup ran successfully and the RIGHT OUTER JOIN returned all four departments, including Civil without students.',
  },
  {
    id: 13,
    title: 'FULL OUTER JOIN',
    shortTitle: 'FULL OUTER JOIN',
    question: 'Write SQL queries to demonstrate FULL OUTER JOIN.',
    aim: 'To create both tables independently and return matching and non-matching rows from STUDENT and DEPARTMENT.',
    dependency: 'Independent practical. It contains its own table creation, constraints, records, verification, and FULL OUTER JOIN.',
    sections: [
      sql('setup', '01 · Create DEPARTMENT', joinDepartmentCreate),
      sql('setup', '02 · Create STUDENT with constraints', joinStudentCreate),
      sql('insert', '03 · Insert four departments', joinDepartmentInsert),
      sql('insert', '04 · Insert six students', joinStudentInsert),
      sql('verify', '05 · Verify tables and records', joinVerify),
      sql('operation', '06 · Execute FULL OUTER JOIN', `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
FULL OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;`),
      sql('cleanup', 'Optional · Cleanup before restarting', joinCleanup),
    ],
    output: [{ label: 'FULL OUTER JOIN output · all matching and unmatched rows', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['NULL', 'NULL', '40', 'Civil'], ['6', 'Neha', 'NULL', 'NULL']] }],
    explanation: ['FULL OUTER JOIN returns every row from both tables, matching rows where the join condition succeeds.', 'Neha appears with NULL department columns, while Civil appears with NULL student columns.', 'The displayed order can vary without ORDER BY; the set of returned rows remains the same.'],
    result: 'The independent setup ran successfully and the FULL OUTER JOIN displayed all matching and non-matching records from both tables.',
  },
]

export { practicals }
