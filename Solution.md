# VNR Warzone — Web CTF Solutions

This document contains the official write-ups for all challenges hosted at:

**Target Application:** [https://meher-ctf.onrender.com](https://vnr-w4rz0n3-ctf.onrender.com)

---

## Chef's Secret Log
**Difficulty:** Easy  
**Points:** 20  
**Flag Format:** `w4rz0n3{}`  
**Flag:** `w4rz0n3{r3g1str4t10n_fl4g_f0und}`

### Challenge Description
The Chef once left a sticky note hidden within the kitchen’s first digital order, an unfinished reminder about an old pantry folder. Believing no one would ever read the kitchen logs, he tucked away his secret there. Within those forgotten notes lies the first clue to his mysterious cookbook.

### Solution
1. The description looks a bit fishy. It mentions the first digital order, which hints toward something related to the very first interaction or request. It also says no one ever read the kitchen logs, suggesting that secrets may be revealed by inspecting logs or hidden developer-side information. Based on this analysis of the story, let’s deep dive further.
2. As the first step, open the target site. Once the site loads, you will be presented with a login page.
<img width="956" height="452" alt="image" src="https://github.com/user-attachments/assets/0e5a4191-97d4-4ea9-9f6a-75348fa5d396" />
3. Since we do not have any test account, create one by clicking on Sign Up.
<img width="953" height="449" alt="image" src="https://github.com/user-attachments/assets/4fda543a-0f6b-4458-81a9-5b9fa02c6363" />
4. Once the account is created, log in using the credentials you just registered with.
5. After logging in, open the browser Developer Tools (`F12`) and navigate to the Console tab. You will find the flag displayed there.
<img width="721" height="346" alt="image" src="https://github.com/user-attachments/assets/301d6b79-e0f2-49c5-a9bd-edb1ba5b7ecd" />

**Key Concept:** Sensitive Data Breache via client-side console logs.

---

## Secret Cellar
**Difficulty:** Easy  
**Points:** 20  
**Flag Format:** `w4rz0n3{}`  
**Flag:** `w4rz0n3{r0b0ts_t3ll_s3cr3ts}`

### Challenge Description
The night janitor once discovered the Chef’s private book hidden deep within the cellar. Unaware of its worth, he marked the place as off-limits before leaving it behind. That forgotten note still lingers in the old kitchen records.

### Solution
1. The description gives a strong hint toward a restricted or off-limits area. The janitor discovering the Chef’s private book and marking the place as off-limits suggests that something was intentionally hidden from regular access. The mention of a forgotten note lingering in old kitchen records implies that the restriction was documented somewhere publicly readable, guiding us to look for standard locations where such restrictions are recorded.
2. So lets check the `/robots.txt` file, which is commonly used to list hidden or restricted paths.
3. You will find the flag directly exposed in the `robots.txt` file.

**Key Concept:** Information disclosure via `robots.txt`.

---

## The Forgotten Ledger
**Difficulty:** Easy  
**Points:** 30  
**Flag Format:** `w4rz0n3{}`  
**Flag:** `w4rz0n3{sql_1nj3ct10n_m4st3r}`

### Challenge Description
Deep within the pantry lies the Archivist’s ledger, meant only for the Chef and his trusted aides. Yet the ledger keeps its secrets loosely bound and reveals more than it should when questioned the wrong way.

### Solution
1. In the previous question, we reviewed the `/robots.txt` file. During that process, we noticed a hidden path named `/secret-search`, which appeared to be intentionally restricted and aligned with the challenge story hinting at a private ledger accessible only to trusted users.
2. So, let’s try navigating to `/secret-search` and see if we can find anything useful. Once we reach that page, we notice an input box, which suggests that the application is accepting user input and interacting with the backend.
3. Next, we test the input field for SQL Injection using a basic payload:
`1 OR 1=1`. This payload works successfully, indicating that the backend query is vulnerable. As a result, the query returns unintended data, which reveals the flag.

**Key Concept:** SQL Injection due to improper input validation.

---

## Echoes of the Crowd
**Difficulty:** Medium  
**Points:** 20  
**Flag Format:** `w4rz0n3{}`  
**Flag:** `w4rz0n3{xss_c0mm3nt_h4ck}`

### Challenge Description
Not all secrets hide in ledgers. Some slip through the voices of diners. The Chef’s review board echoes every word without thought, turning reflections into something dangerous.

### Solution
1. The challenge description hints that secrets are revealed through the voices of diners, implying user-generated input such as comments or feedback. The line about the review board echoing every word without thought suggests that the application reflects user input back to the page without proper validation or sanitization, which is a classic indicator of a Cross-Site Scripting vulnerability.
2. Now let’s go back to the main dashboard and navigate to the Reviews / Feedback section.
3. Here, we will find an input field where user comments are displayed back to users.
4. So, let’s try testing for Cross-Site Scripting (XSS) using: `<script>alert(1)</script>` in all the fields and click on submit.
5. We will see that the script executes successfully, confirming a reflected XSS vulnerability, and it retrieves the flag.

**Key Concept:** Reflected XSS due to lack of output encoding.

---

## The Secret Shelf
**Difficulty:** Medium  
**Points:** 50  
**Flag Format:** `w4rz0n3{}`  
**Flag:** `w4rz0n3{1d0r_4dm1n_4cc3ss}`

### Challenge Description
At the far end of the pantry rests the Chef’s private ledger, meant only for trusted staff. The shelf labels look firm, but a curious guest who alters the markings may uncover forbidden records.

### Solution
1. The challenge description hints at a restricted ledger accessible only to trusted staff, while also mentioning that the shelf labels can be altered. This suggests improper access controls or manipulatable identifiers that allow unauthorized users to view protected records. With this in mind, we revisit known restricted paths to look for administrative functionality.
2. Let’s now go back to the /robots.txt directory, where we previously identified another path named /admin.
3. Next, try accessing /admin, where we observe a user management panel.
4. Monitor the network requests, and we will discover an API endpoint: `/api/users`.
5. This API returns a JSON response containing user IDs and their admin status.
6. While reviewing the JavaScript source, we find another endpoint: `/api/user/profile/{id}`.
7. When we dive deeper, we observe that the {id} parameter must be Base64 encoded.
8. Next, encode the user IDs obtained from `/api/users` and query the profile endpoint.
9. One of the responses returns admin data along with the flag.

**Key Concept:** IDOR (Insecure Direct Object Reference) with weak access control.

---

Happy Hacking!!

