export const practicals = [
  {
    id: 1,
    title: 'DDL Operations',
    shortTitle: 'DDL Operations',
    question: 'Create a STUDENT table with attributes Roll No., Student Name, Gender, City, Marks, and Dept ID. Perform CREATE, ALTER, RENAME, DROP operations.',
    aim: 'To study and perform Data Definition Language (DDL) operations on a STUDENT table.',
    dependency: 'Creates and drops its own STUDENT table. Run this practical independently before Practical 2.',
    sections: [
      {
        heading: 'Complete Oracle 10g SQL',
        code: `CREATE TABLE STUDENT (
    ROLL_NO NUMBER(5) PRIMARY KEY,
    STUDENT_NAME VARCHAR2(30),
    GENDER VARCHAR2(10),
    CITY VARCHAR2(30),
    MARKS NUMBER(5,2),
    DEPT_ID NUMBER(5)
);

ALTER TABLE STUDENT ADD (EMAIL VARCHAR2(50));

ALTER TABLE STUDENT
MODIFY (STUDENT_NAME VARCHAR2(50));

ALTER TABLE STUDENT DROP COLUMN EMAIL;

RENAME STUDENT TO STUDENT_TEMP;

RENAME STUDENT_TEMP TO STUDENT;

DROP TABLE STUDENT;`,
      },
    ],
    output: [{ label: 'Execution result', value: 'Table created. Table altered three times. Table renamed to STUDENT_TEMP and back to STUDENT. Table dropped successfully.' }],
    explanation: [
      'CREATE TABLE defines a table and its columns with Oracle data types.',
      'ALTER TABLE changes an existing table by adding, modifying, or dropping columns.',
      'RENAME changes the table object name, while DROP TABLE permanently removes the table.',
      'DDL statements cause an implicit COMMIT in Oracle.',
    ],
    result: 'All required DDL operations were performed successfully on the STUDENT table.',
  },
  {
    id: 2,
    title: 'Primary Key and Foreign Key',
    shortTitle: 'Primary & Foreign Keys',
    question: 'Create STUDENT and DEPARTMENT tables using PRIMARY KEY, FOREIGN KEY operations.',
    aim: 'To create related tables and enforce entity integrity and referential integrity with primary and foreign keys.',
    dependency: 'Creates the STUDENT and DEPARTMENT tables reused by Practicals 10–13. Run after Practical 1 if that table was dropped.',
    sections: [
      {
        heading: 'Create tables and constraints',
        code: `CREATE TABLE DEPARTMENT (
    DEPT_ID NUMBER(5),
    DEPT_NAME VARCHAR2(30) NOT NULL,
    CONSTRAINT PK_DEPARTMENT PRIMARY KEY (DEPT_ID)
);

CREATE TABLE STUDENT (
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
);`,
      },
      {
        heading: 'Insert sample records and display them',
        code: `INSERT INTO DEPARTMENT VALUES (10, 'Computer');
INSERT INTO DEPARTMENT VALUES (20, 'Information Technology');
INSERT INTO DEPARTMENT VALUES (30, 'Mechanical');
INSERT INTO DEPARTMENT VALUES (40, 'Civil');

INSERT INTO STUDENT VALUES (1, 'Suraj', 'Male', 'Pune', 85, 10);
INSERT INTO STUDENT VALUES (2, 'Asha', 'Female', 'Mumbai', 90, 10);
INSERT INTO STUDENT VALUES (3, 'Rahul', 'Male', 'Alibag', 78, 20);
INSERT INTO STUDENT VALUES (4, 'Priya', 'Female', 'Pune', 88, 20);
INSERT INTO STUDENT VALUES (5, 'Aman', 'Male', 'Panvel', 76, 30);
INSERT INTO STUDENT VALUES (6, 'Neha', 'Female', 'Pune', 92, NULL);

SELECT * FROM DEPARTMENT;
SELECT * FROM STUDENT;`,
      },
    ],
    output: [
      { label: 'DEPARTMENT', columns: ['DEPT_ID', 'DEPT_NAME'], rows: [['10', 'Computer'], ['20', 'Information Technology'], ['30', 'Mechanical'], ['40', 'Civil']] },
      { label: 'STUDENT', columns: ['ROLL_NO', 'STUDENT_NAME', 'GENDER', 'CITY', 'MARKS', 'DEPT_ID'], rows: [['1', 'Suraj', 'Male', 'Pune', '85', '10'], ['2', 'Asha', 'Female', 'Mumbai', '90', '10'], ['3', 'Rahul', 'Male', 'Alibag', '78', '20'], ['4', 'Priya', 'Female', 'Pune', '88', '20'], ['5', 'Aman', 'Male', 'Panvel', '76', '30'], ['6', 'Neha', 'Female', 'Pune', '92', 'NULL']] },
    ],
    explanation: ['A PRIMARY KEY uniquely identifies each row and cannot contain NULL values.', 'A FOREIGN KEY links STUDENT.DEPT_ID to the parent DEPARTMENT.DEPT_ID.', 'The parent department rows must exist before students can reference them.'],
    result: 'The two tables were created with valid constraints, and sample records were inserted and displayed successfully.',
  },
  {
    id: 3,
    title: 'DML Operations',
    shortTitle: 'DML Operations',
    question: 'Create an EMPLOYEE table and perform INSERT, SELECT, UPDATE, and DELETE operations on employee records.',
    aim: 'To perform Data Manipulation Language (DML) operations on employee records.',
    dependency: 'Creates and populates EMPLOYEE, which is used by Practicals 6 and 7.',
    sections: [{ heading: 'Complete Oracle 10g SQL', code: `CREATE TABLE EMPLOYEE (
    EMP_ID NUMBER(5) PRIMARY KEY,
    EMP_NAME VARCHAR2(30),
    DEPT_ID NUMBER(5),
    SALARY NUMBER(10,2)
);

INSERT INTO EMPLOYEE VALUES (101, 'Aarav', 10, 55000);
INSERT INTO EMPLOYEE VALUES (102, 'Diya', 10, 45000);
INSERT INTO EMPLOYEE VALUES (103, 'Ishaan', 20, 60000);
INSERT INTO EMPLOYEE VALUES (104, 'Mira', 20, 35000);
INSERT INTO EMPLOYEE VALUES (105, 'Kabir', 30, 50000);
INSERT INTO EMPLOYEE VALUES (106, 'Anaya', 30, 40000);
INSERT INTO EMPLOYEE VALUES (107, 'TestDelete', 40, 20000);
INSERT INTO EMPLOYEE VALUES (108, 'Nikhil', 40, 30000);
INSERT INTO EMPLOYEE VALUES (109, 'Pooja', 40, 35000);

SELECT * FROM EMPLOYEE;

UPDATE EMPLOYEE
SET SALARY = 48000
WHERE EMP_ID = 102;

SELECT * FROM EMPLOYEE WHERE EMP_ID = 102;

DELETE FROM EMPLOYEE
WHERE EMP_ID = 107;

SELECT * FROM EMPLOYEE;

COMMIT;` }],
    output: [{ label: 'Final EMPLOYEE rows after UPDATE and DELETE', columns: ['EMP_ID', 'EMP_NAME', 'DEPT_ID', 'SALARY'], rows: [['101', 'Aarav', '10', '55000'], ['102', 'Diya', '10', '48000'], ['103', 'Ishaan', '20', '60000'], ['104', 'Mira', '20', '35000'], ['105', 'Kabir', '30', '50000'], ['106', 'Anaya', '30', '40000'], ['108', 'Nikhil', '40', '30000'], ['109', 'Pooja', '40', '35000']] }],
    explanation: ['INSERT adds new rows to a table.', 'SELECT reads rows from a table.', 'UPDATE changes values that match its WHERE condition.', 'DELETE removes matching rows, and COMMIT permanently saves the transaction.'],
    result: 'Employee data was inserted, one salary was updated, one test record was deleted, and the final transaction was committed.',
  },
  {
    id: 4,
    title: 'GRANT and REVOKE',
    shortTitle: 'GRANT & REVOKE',
    question: 'Demonstrate the GRANT and REVOKE commands to provide and withdraw SELECT and INSERT privileges on a table.',
    aim: 'To understand how Oracle privileges can be granted to and withdrawn from another user.',
    dependency: 'Requires administrator access for user creation and login privileges. Table privileges must be granted by the STUDENT table owner or an appropriately authorized user.',
    sections: [
      { heading: 'As an administrator', code: `CREATE USER LAB_USER IDENTIFIED BY lab123;

GRANT CREATE SESSION TO LAB_USER;` },
      { heading: 'As the STUDENT table owner', code: `GRANT SELECT, INSERT ON STUDENT TO LAB_USER;

REVOKE SELECT, INSERT ON STUDENT FROM LAB_USER;` },
    ],
    output: [{ label: 'Privilege result', value: 'LAB_USER can log in after CREATE SESSION is granted. SELECT and INSERT are available after GRANT and withdrawn after REVOKE.' }],
    explanation: ['CREATE USER and GRANT CREATE SESSION require administrator permissions.', 'GRANT SELECT, INSERT gives LAB_USER read and insert privileges on STUDENT.', 'REVOKE removes those object privileges from LAB_USER.'],
    result: 'The required table privileges were granted and then successfully withdrawn.',
  },
  {
    id: 5,
    title: 'COMMIT and ROLLBACK',
    shortTitle: 'COMMIT & ROLLBACK',
    question: 'Demonstrate COMMIT, ROLLBACK commands using a BANK_ACCOUNT table to manage transactions.',
    aim: 'To demonstrate transaction control using COMMIT and ROLLBACK in Oracle 10g.',
    dependency: 'Creates its own BANK_ACCOUNT table and does not depend on another practical.',
    sections: [{ heading: 'Complete Oracle 10g SQL', code: `CREATE TABLE BANK_ACCOUNT (
    ACCOUNT_NO NUMBER(5) PRIMARY KEY,
    HOLDER_NAME VARCHAR2(30),
    BALANCE NUMBER(10,2)
);

INSERT INTO BANK_ACCOUNT VALUES (1001, 'Suraj', 10000);
INSERT INTO BANK_ACCOUNT VALUES (1002, 'Amit', 5000);

COMMIT;

SELECT * FROM BANK_ACCOUNT;

UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE - 1000
WHERE ACCOUNT_NO = 1001;

UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE + 1000
WHERE ACCOUNT_NO = 1002;

COMMIT;

SELECT * FROM BANK_ACCOUNT;

UPDATE BANK_ACCOUNT
SET BALANCE = BALANCE - 500
WHERE ACCOUNT_NO = 1001;

ROLLBACK;

SELECT * FROM BANK_ACCOUNT;` }],
    output: [
      { label: 'After first COMMIT', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '10000'], ['1002', 'Amit', '5000']] },
      { label: 'After transfer COMMIT', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '9000'], ['1002', 'Amit', '6000']] },
      { label: 'After ROLLBACK', columns: ['ACCOUNT_NO', 'HOLDER_NAME', 'BALANCE'], rows: [['1001', 'Suraj', '9000'], ['1002', 'Amit', '6000']] },
    ],
    explanation: ['COMMIT permanently saves all changes made in the current transaction.', 'ROLLBACK cancels uncommitted changes and returns the data to the last COMMIT state.', 'The final withdrawal of 500 is undone, so the balance returns to 9000.'],
    result: 'COMMIT saved the transfer, while ROLLBACK correctly cancelled the later uncommitted withdrawal.',
  },
  {
    id: 6,
    title: 'Aggregate Functions',
    shortTitle: 'Aggregate Functions',
    question: 'Using EMPLOYEE table, write queries to find the total number of employees, maximum salary, minimum salary, average salary, and total salary expenditure.',
    aim: 'To use Oracle aggregate functions to summarize values in the EMPLOYEE table.',
    dependency: 'Uses the final EMPLOYEE data from Practical 3: eight rows after the delete and salary update.',
    sections: [{ heading: 'Aggregate queries', code: `SELECT COUNT(*) AS TOTAL_EMPLOYEES FROM EMPLOYEE;

SELECT MAX(SALARY) AS MAX_SALARY FROM EMPLOYEE;

SELECT MIN(SALARY) AS MIN_SALARY FROM EMPLOYEE;

SELECT AVG(SALARY) AS AVERAGE_SALARY FROM EMPLOYEE;

SELECT SUM(SALARY) AS TOTAL_SALARY FROM EMPLOYEE;

SELECT
    COUNT(*) AS TOTAL_EMPLOYEES,
    MAX(SALARY) AS MAX_SALARY,
    MIN(SALARY) AS MIN_SALARY,
    AVG(SALARY) AS AVG_SALARY,
    SUM(SALARY) AS TOTAL_SALARY
FROM EMPLOYEE;` }],
    output: [{ label: 'Expected results from Practical 3', columns: ['TOTAL_EMPLOYEES', 'MAX_SALARY', 'MIN_SALARY', 'AVG_SALARY', 'TOTAL_SALARY'], rows: [['8', '60000', '30000', '44125', '353000']] }],
    explanation: ['COUNT counts rows, MAX finds the highest value, and MIN finds the lowest value.', 'AVG calculates the arithmetic mean of non-NULL salaries.', 'SUM returns the total salary expenditure.'],
    result: 'The aggregate queries returned the correct summary of the eight employee records.',
  },
  {
    id: 7,
    title: 'GROUP BY and HAVING',
    shortTitle: 'GROUP BY & HAVING',
    question: 'Write SQL queries to display the number of employees in each department and identify departments whose average salary exceeds 40,000.',
    aim: 'To group employee records by department and filter grouped results with HAVING.',
    dependency: 'Uses the EMPLOYEE data created in Practical 3.',
    sections: [
      { heading: 'Count employees by department', code: `SELECT
    DEPT_ID,
    COUNT(*) AS TOTAL_EMPLOYEES
FROM EMPLOYEE
GROUP BY DEPT_ID
ORDER BY DEPT_ID;` },
      { heading: 'Departments with average salary above 40,000', code: `SELECT
    DEPT_ID,
    AVG(SALARY) AS AVERAGE_SALARY
FROM EMPLOYEE
GROUP BY DEPT_ID
HAVING AVG(SALARY) > 40000;` },
    ],
    output: [
      { label: 'Employee count by department', columns: ['DEPT_ID', 'TOTAL_EMPLOYEES'], rows: [['10', '2'], ['20', '2'], ['30', '2'], ['40', '2']] },
      { label: 'Average salary above 40,000', columns: ['DEPT_ID', 'AVERAGE_SALARY'], rows: [['10', '51500'], ['20', '47500'], ['30', '45000']] },
    ],
    explanation: ['GROUP BY combines rows with the same DEPT_ID so an aggregate can be calculated for each group.', 'HAVING filters groups after aggregation; WHERE filters individual rows before grouping.', 'Departments 10, 20, and 30 have average salaries greater than 40,000.'],
    result: 'Employee counts and departments meeting the average salary condition were displayed correctly.',
  },
  {
    id: 8,
    title: 'STUDENT_A and STUDENT_B',
    shortTitle: 'STUDENT_A & STUDENT_B',
    question: 'Create two tables STUDENT_A and STUDENT_B containing student names.',
    aim: 'To create two simple tables, insert student names, and display their contents.',
    dependency: 'Creates independent STUDENT_A and STUDENT_B tables.',
    sections: [{ heading: 'Complete Oracle 10g SQL', code: `CREATE TABLE STUDENT_A (
    STUDENT_NAME VARCHAR2(30)
);

CREATE TABLE STUDENT_B (
    STUDENT_NAME VARCHAR2(30)
);

INSERT INTO STUDENT_A VALUES ('Suraj');
INSERT INTO STUDENT_A VALUES ('Asha');
INSERT INTO STUDENT_A VALUES ('Rahul');
INSERT INTO STUDENT_A VALUES ('Neha');

INSERT INTO STUDENT_B VALUES ('Rahul');
INSERT INTO STUDENT_B VALUES ('Neha');
INSERT INTO STUDENT_B VALUES ('Karan');
INSERT INTO STUDENT_B VALUES ('Priya');

SELECT * FROM STUDENT_A;
SELECT * FROM STUDENT_B;

COMMIT;` }],
    output: [
      { label: 'STUDENT_A', columns: ['STUDENT_NAME'], rows: [['Suraj'], ['Asha'], ['Rahul'], ['Neha']] },
      { label: 'STUDENT_B', columns: ['STUDENT_NAME'], rows: [['Rahul'], ['Neha'], ['Karan'], ['Priya']] },
    ],
    explanation: ['CREATE TABLE defines each table with one VARCHAR2 column.', 'INSERT adds one student name per row.', 'SELECT displays each table, and COMMIT saves the inserted rows.'],
    result: 'Both student tables were created, populated, displayed, and committed successfully.',
  },
  {
    id: 9,
    title: 'String Functions',
    shortTitle: 'String Functions',
    question: 'Write SQL queries using UPPER(), LOWER(), INITCAP(), LENGTH(), SUBSTR(), INSTR(), CONCAT(), and TRIM() to manipulate student names.',
    aim: 'To use common Oracle string functions with standalone expressions from the DUAL table.',
    dependency: 'Uses DUAL for standalone Oracle string function examples and does not depend on a user table.',
    sections: [{ heading: 'Oracle string function queries', code: `SELECT UPPER('suraj sahu') FROM DUAL;

SELECT LOWER('SURAJ SAHU') FROM DUAL;

SELECT INITCAP('suraj sahu') FROM DUAL;

SELECT LENGTH('SURAJ') FROM DUAL;

SELECT SUBSTR('SURAJ SAHU', 1, 5) FROM DUAL;

SELECT INSTR('SURAJ SAHU', 'A') FROM DUAL;

SELECT CONCAT('SURAJ', ' SAHU') FROM DUAL;

SELECT TRIM(' ' FROM '  SURAJ SAHU  ') FROM DUAL;` }],
    output: [
      { label: 'Function results', columns: ['FUNCTION', 'OUTPUT', 'PURPOSE'], rows: [['UPPER', 'SURAJ SAHU', 'Converts text to uppercase'], ['LOWER', 'suraj sahu', 'Converts text to lowercase'], ['INITCAP', 'Suraj Sahu', 'Capitalizes each word'], ['LENGTH', '5', 'Returns character count'], ['SUBSTR', 'SURAJ', 'Extracts a substring'], ['INSTR', '4', 'Returns the position of A'], ['CONCAT', 'SURAJ SAHU', 'Joins two strings'], ['TRIM', 'SURAJ SAHU', 'Removes surrounding spaces']] },
    ],
    explanation: ['UPPER, LOWER, and INITCAP change the case of text.', 'LENGTH counts characters; SUBSTR extracts text using a starting position and length.', 'INSTR returns the position of a search string. CONCAT accepts exactly two arguments in Oracle.', 'TRIM removes leading and trailing spaces from a string.'],
    result: 'All eight Oracle string functions returned the expected values using DUAL.',
  },
  {
    id: 10,
    title: 'INNER JOIN',
    shortTitle: 'INNER JOIN',
    question: 'Create STUDENT and DEPARTMENT tables and display student names along with their respective department names using INNER JOIN.',
    aim: 'To combine matching rows from STUDENT and DEPARTMENT using an INNER JOIN.',
    dependency: 'Reuses the STUDENT and DEPARTMENT tables and sample data from Practical 2. Do not recreate them unnecessarily.',
    sections: [{ heading: 'INNER JOIN query', code: `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_NAME
FROM STUDENT S
INNER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;` }],
    output: [{ label: 'Matching student and department rows', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_NAME'], rows: [['1', 'Suraj', 'Computer'], ['2', 'Asha', 'Computer'], ['3', 'Rahul', 'Information Technology'], ['4', 'Priya', 'Information Technology'], ['5', 'Aman', 'Mechanical']] }],
    explanation: ['INNER JOIN returns only rows where the join condition matches in both tables.', 'Neha has a NULL DEPT_ID, so she is not included in the result.', 'The query uses aliases S and D to keep column references concise.'],
    result: 'The names of students with a matching department were displayed successfully.',
  },
  {
    id: 11,
    title: 'LEFT OUTER JOIN',
    shortTitle: 'LEFT OUTER JOIN',
    question: 'Write SQL queries to demonstrate LEFT OUTER JOIN.',
    aim: 'To display every record from the left STUDENT table and matching department details when available.',
    dependency: 'Reuses the STUDENT and DEPARTMENT tables from Practical 2.',
    sections: [{ heading: 'LEFT OUTER JOIN query', code: `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
LEFT OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;` }],
    output: [{ label: 'All students, with matching departments', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['6', 'Neha', 'NULL', 'NULL']] }],
    explanation: ['A LEFT OUTER JOIN returns every row from the left table.', 'When no department matches, the department columns contain NULL.', 'Neha remains visible because STUDENT is the left table.'],
    result: 'Every student was returned, including the student without a department assignment.',
  },
  {
    id: 12,
    title: 'RIGHT OUTER JOIN',
    shortTitle: 'RIGHT OUTER JOIN',
    question: 'Write SQL queries to demonstrate RIGHT OUTER JOIN.',
    aim: 'To display every record from the right DEPARTMENT table and matching student details when available.',
    dependency: 'Reuses the STUDENT and DEPARTMENT tables from Practical 2.',
    sections: [{ heading: 'RIGHT OUTER JOIN query', code: `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
RIGHT OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;` }],
    output: [{ label: 'All departments, with matching students', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['NULL', 'NULL', '40', 'Civil']] }],
    explanation: ['A RIGHT OUTER JOIN returns every row from the right table.', 'Civil has no matching student, so the student columns are NULL for department 40.', 'The right table here is DEPARTMENT because it appears after the JOIN keyword.'],
    result: 'All departments were returned, including the department without a student assignment.',
  },
  {
    id: 13,
    title: 'FULL OUTER JOIN',
    shortTitle: 'FULL OUTER JOIN',
    question: 'Write SQL queries to demonstrate FULL OUTER JOIN.',
    aim: 'To display all matching and non-matching rows from both STUDENT and DEPARTMENT.',
    dependency: 'Reuses the STUDENT and DEPARTMENT tables from Practical 2.',
    sections: [{ heading: 'FULL OUTER JOIN query', code: `SELECT
    S.ROLL_NO,
    S.STUDENT_NAME,
    D.DEPT_ID,
    D.DEPT_NAME
FROM STUDENT S
FULL OUTER JOIN DEPARTMENT D
ON S.DEPT_ID = D.DEPT_ID;` }],
    output: [{ label: 'All students and all departments', columns: ['ROLL_NO', 'STUDENT_NAME', 'DEPT_ID', 'DEPT_NAME'], rows: [['1', 'Suraj', '10', 'Computer'], ['2', 'Asha', '10', 'Computer'], ['3', 'Rahul', '20', 'Information Technology'], ['4', 'Priya', '20', 'Information Technology'], ['5', 'Aman', '30', 'Mechanical'], ['6', 'Neha', 'NULL', 'NULL'], ['NULL', 'NULL', '40', 'Civil']] }],
    explanation: ['A FULL OUTER JOIN returns every matching and non-matching row from both tables.', 'Unmatched columns are filled with NULL.', 'The result includes both Neha without a department and Civil without a student.'],
    result: 'All matching and non-matching records from STUDENT and DEPARTMENT were displayed successfully.',
  },
]

export const getPractical = (id) => practicals.find((practical) => practical.id === Number(id))
