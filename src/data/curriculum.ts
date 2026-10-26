import { CodeMission } from '../types/game';

export const CODE_MISSIONS: CodeMission[] = [
  // ================= NEON ACADEMY =================
  {
    id: 'neon-intro-vars',
    districtId: 'neon-academy',
    title: 'Repair Robot SENTRY-7',
    summary: 'Restore the malfunctioning patrol robot by initializing its core memory variables.',
    storyContext: 'SENTRY-7 is spinning in circles claiming its battery is "NaN" and its status is broken. NULL corrupted its memory partition!',
    language: 'python',
    concept: 'Variables & Data Types',
    starterCode: `# SENTRY-7 Memory Repair Protocol
# TODO: Set battery to 100 (integer) and status to "ONLINE" (string)

battery = 0
status = "OFFLINE"
name = "SENTRY-7"

# Complete the repair below:
battery = 
status = 

print(f"{name} status: {status}, battery: {battery}%")`,
    solutionSnippet: 'battery = 100\nstatus = "ONLINE"',
    hints: [
      'Assign the number 100 to the variable battery: battery = 100',
      'Assign the exact string "ONLINE" in double or single quotes: status = "ONLINE"',
      'Do not put quotes around the number 100, or it becomes a string!'
    ],
    byteRoast: "A battery of 0? If I ran on that, I'd be as lifeless as an uncharged toothbrush.",
    byteSuccess: "Beep boop! Look at that, SENTRY-7 stopped walking into walls. You're practically a digital doctor.",
    testCases: [
      {
        description: 'Verify status is set to ONLINE',
        expectedOutput: 'SENTRY-7 status: ONLINE, battery: 100%',
      }
    ],
    xpReward: 120,
    creditsReward: 50,
    itemReward: {
      id: 'neon-visor-blue',
      name: 'Cyber Scan Visor',
      type: 'visor',
      rarity: 'Common',
      description: 'Emits a crisp cyan reticle. Highlights syntax errors at 20 paces.',
      statBonus: '+5% Code Insight',
      equipped: true,
    },
    badgeReward: 'Syntax Initiate',
  },
  {
    id: 'neon-gate-logic',
    districtId: 'neon-academy',
    title: 'The Academy Gate Protocol',
    summary: 'Program the security gate to grant access only if the player has authorization.',
    storyContext: 'The gatekeeper mainframe requires an if/else verification check. If clearance_level is 3 or higher, output "ACCESS GRANTED", otherwise "ACCESS DENIED".',
    language: 'python',
    concept: 'Conditionals (if / else)',
    starterCode: `clearance_level = 4

# TODO: Write an if/else check
# If clearance_level is greater than or equal to 3:
#     print("ACCESS GRANTED")
# Else:
#     print("ACCESS DENIED")

if clearance_level >= 3:
    print("ACCESS GRANTED")
else:
    print("ACCESS DENIED")`,
    solutionSnippet: 'if clearance_level >= 3:\n    print("ACCESS GRANTED")',
    hints: [
      'Python uses indentation (4 spaces) inside if and else blocks.',
      'Comparison operator for greater than or equal to is >=',
      'Remember the colons (:) at the end of if and else lines!'
    ],
    byteRoast: "If you mess this up, the gate will assume we are unauthorized spam bots and vaporize my antenna.",
    byteSuccess: "Gate disengaged! Welcome to the wider Cyberverse. Try not to trip over broken packets.",
    testCases: [
      {
        description: 'Check access granting for clearance level 4',
        expectedOutput: 'ACCESS GRANTED',
      }
    ],
    xpReward: 150,
    creditsReward: 75,
  },
  {
    id: 'neon-boss-semicolon',
    districtId: 'neon-academy',
    title: 'BOSS: The Semicolon Monster',
    summary: 'Defeat the manifestation of syntax errors by repairing the corrupted combat script!',
    storyContext: 'THE SEMICOLON MONSTER is draining Neon Academy! It feeds on unclosed brackets, missing colons, and illegal syntax. Fix the counter-strike script to vanquish it!',
    language: 'python',
    concept: 'Debugging & Syntax Rectification',
    starterCode: `# BOSS BATTLE: Counter-Strike Protocol
# BUG REPORT: Fix the 3 syntax errors in this script!

def fire_laser(power):
    # Error 1: Missing colon on function header? (Already fixed)
    target = "SEMICOLON MONSTER"
    
    # Error 2: Fix unclosed string quote below
    charge_level = "MAXIMUM
    
    # Error 3: Fix the if statement syntax
    if power > 50
        print(f"CRITICAL HIT on {target}! Laser power: {power}kW")

fire_laser(99)`,
    solutionSnippet: 'charge_level = "MAXIMUM"\n    if power > 50:',
    hints: [
      'Close the string literal on charge_level with a matching double quote: "MAXIMUM"',
      'In Python, every if statement requires a colon (:) at the end: if power > 50:'
    ],
    byteRoast: "The monster has 9,000 health. Its weakness? Basic punctuation. Don't embarrass us.",
    byteSuccess: "BOOM! The Semicolon Monster dissolved into clean commas and dots! First boss down!",
    testCases: [
      {
        description: 'Laser successfully hits Semicolon Monster with 99kW',
        expectedOutput: 'CRITICAL HIT on SEMICOLON MONSTER! Laser power: 99kW',
      }
    ],
    xpReward: 300,
    creditsReward: 150,
    isBossMission: true,
    badgeReward: 'Semicolon Slayer',
  },

  // ================= PYTHON PORT =================
  {
    id: 'python-delivery-bot',
    districtId: 'python-port',
    title: 'Automate Delivery Drone',
    summary: 'Write a loop to process delivery packages in the cargo queue.',
    storyContext: 'Docks 4 through 7 are jammed with autonomous drones. The drones need a Python for loop to iterate over the cargo manifest and deliver each item.',
    language: 'python',
    concept: 'Lists & For Loops',
    starterCode: `cargo_manifest = ["Quantum Core", "Neural Patch", "Cooling Gel"]

# TODO: Use a for loop to iterate through cargo_manifest
# For each item, print: "Delivering: " + item

for item in cargo_manifest:
    print("Delivering: " + item)`,
    solutionSnippet: 'for item in cargo_manifest:\n    print("Delivering: " + item)',
    hints: [
      'Use the syntax: for item in cargo_manifest:',
      'Indent the print statement underneath the for loop.'
    ],
    byteRoast: "A drone with no loop is like a Roomba in an open desert. It just goes until it hits a rock.",
    byteSuccess: "Clean delivery! All cargo accounted for. The Dockmaster sends his regards.",
    testCases: [
      {
        description: 'Verify each cargo item is delivered in sequence',
        expectedOutput: 'Delivering: Quantum Core\nDelivering: Neural Patch\nDelivering: Cooling Gel',
      }
    ],
    xpReward: 180,
    creditsReward: 90,
  },
  {
    id: 'python-boss-loopzilla',
    districtId: 'python-port',
    title: 'BOSS: Loopzilla',
    summary: 'Loopzilla is stuck in an infinite while loop! Fix the condition and decrement to free the port.',
    storyContext: 'Loopzilla is stomping the shipping crates infinitely because its while-loop condition never decreases! Patch its logic core before the CPU catches fire.',
    language: 'python',
    concept: 'Loop Bounds & Infinite Loop Prevention',
    starterCode: `# BOSS BATTLE: Loopzilla Termination Script
# BUG: The while loop currently runs forever because rampaging_charge never decreases!

def calm_loopzilla():
    rampaging_charge = 3
    
    # TODO: Ensure the loop runs while rampaging_charge > 0, 
    # and decrement rampaging_charge by 1 in each step.
    while rampaging_charge > 0:
        print(f"Depleting rage field: {rampaging_charge}")
        rampaging_charge -= 1
        
    print("Loopzilla calm! Infinite loop terminated.")

calm_loopzilla()`,
    solutionSnippet: 'rampaging_charge -= 1',
    hints: [
      'An infinite loop occurs when the loop condition never becomes False.',
      'Decrementing rampaging_charge by 1 (rampaging_charge -= 1) ensures it reaches 0 and stops safely.'
    ],
    byteRoast: "While True: byte.scream(). That was almost our fate. Decrement that counter now!",
    byteSuccess: "Loopzilla shut down gracefully without a stack overflow! The port is saved!",
    testCases: [
      {
        description: 'Confirm loop decrements from 3 to 0 and prints termination message',
        expectedOutput: 'Depleting rage field: 3\nDepleting rage field: 2\nDepleting rage field: 1\nLoopzilla calm! Infinite loop terminated.',
      }
    ],
    xpReward: 350,
    creditsReward: 200,
    isBossMission: true,
    badgeReward: 'Loop Tamer',
  },

  // ================= LINUX UNDERGROUND =================
  {
    id: 'linux-ls-grep',
    districtId: 'linux-underground',
    title: 'Investigate the Breach Logs',
    summary: 'Use safe Linux command lines to locate the intruder trace in the terminal.',
    storyContext: 'NULL penetrated the Underground catacombs. We need you to query the authentication log file for failed login attempts using grep.',
    language: 'bash',
    concept: 'Linux Terminal & Text Filtering (grep, ls, cat)',
    starterCode: `# Type the Linux command to filter lines containing "FAILED" from "auth.log"
# Tip: grep "KEYWORD" filename

grep "FAILED" auth.log`,
    solutionSnippet: 'grep "FAILED" auth.log',
    hints: [
      'The grep command is used for searching plain-text datasets: grep "PATTERN" FILE',
      'Target filename is auth.log and search string is "FAILED"'
    ],
    byteRoast: "Don't use sudo unless you know what you're doing. I've seen rookies delete their own bootloader.",
    byteSuccess: "Log filtered! Found 4 unauthorized brute-force attempts from IP 10.0.99.12.",
    testCases: [
      {
        description: 'Output extracted failed log entries',
        expectedOutput: '[AUTH_LOG] 23:14:02 FAILED login for user: admin from 10.0.99.12\n[AUTH_LOG] 23:14:05 FAILED login for user: root from 10.0.99.12',
      }
    ],
    xpReward: 200,
    creditsReward: 100,
    type: 'terminal',
  },
  {
    id: 'linux-boss-root-rogue',
    districtId: 'linux-underground',
    title: 'BOSS: Root Rogue',
    summary: 'Locate the rogue background daemon process and kill it using signal 9.',
    storyContext: 'A corrupted daemon named `null_rogue_daemon` is running as PID 7331, siphoning system entropy. Terminate it with kill -9!',
    language: 'bash',
    concept: 'Process Management (kill, ps, signals)',
    starterCode: `# Terminate the malicious process running on PID 7331
# Command syntax: kill -9 <PID>

kill -9 7331`,
    solutionSnippet: 'kill -9 7331',
    hints: [
      'Signal -9 sends SIGKILL, forcing the operating system to immediately terminate the process.',
      'Target PID is 7331.'
    ],
    byteRoast: "A rogue daemon with root rights? Sounds like my ex-firmware.",
    byteSuccess: "Process 7331 terminated with SIGKILL! The kernel catacombs are quiet once more.",
    testCases: [
      {
        description: 'Kill malicious PID 7331',
        expectedOutput: '[KERNEL] Process 7331 (null_rogue_daemon) killed. Signal 9 acknowledged.',
      }
    ],
    xpReward: 400,
    creditsReward: 250,
    isBossMission: true,
    badgeReward: 'Process Slayer',
    type: 'terminal',
  },

  // ================= CYBER DEFENSE CITY =================
  {
    id: 'cyber-phishing-drill',
    districtId: 'cyber-defense',
    title: 'Spear-Phishing Detection Drill',
    summary: 'Analyze a suspicious message sent to Cyber Defense high command and flag spoofing indicators.',
    storyContext: 'An urgent memo claims to be from "Guardian Commander" requesting immediate password resets via an external link. Detect the anomalies!',
    language: 'cyberdefense',
    concept: 'Email Security, SPF/DKIM & Social Engineering',
    starterCode: `# Phishing Analysis Protocol
# Email Subject: "URGENT: All Guardian Passwords Expire in 10 Minutes!"
# From: commander@cyber-guardians-security.tk
# Link: http://192.168.1.99/update-creds?user=guardian

# Is this email PHISHING or LEGITIMATE?
result = "PHISHING"
reason = "SUSPICIOUS_DOMAIN_AND_URGENCY"

print(f"VERDICT: {result} - {reason}")`,
    solutionSnippet: 'result = "PHISHING"',
    hints: [
      'Look at the top-level domain (.tk instead of official internal domain).',
      'Notice the artificial urgency ("Expire in 10 Minutes") and unencrypted HTTP IP address link.'
    ],
    byteRoast: "If someone offers you 1,000,000 free Cyber-Bits via an unverified link, it's not Santa Claus. It's malware.",
    byteSuccess: "Spot on! Attack intercepted before anyone entered credentials. Defense rating +25.",
    testCases: [
      {
        description: 'Flag phishing attempt',
        expectedOutput: 'VERDICT: PHISHING - SUSPICIOUS_DOMAIN_AND_URGENCY',
      }
    ],
    xpReward: 220,
    creditsReward: 120,
    type: 'phishing',
  },
  {
    id: 'cyber-boss-hydra',
    districtId: 'cyber-defense',
    title: 'BOSS: The Phishing Hydra',
    summary: 'Configure DMARC, SPF, and Multi-Factor Authentication to shield the central bank.',
    storyContext: 'The Phishing Hydra is flooding the gateway with lookalike spoofed domains. Deploy strict DMARC policy="reject" and enforce MFA to sever its heads!',
    language: 'cyberdefense',
    concept: 'Defensive Architecture & Domain Protection',
    starterCode: `# DEFENSE CONFIGURATION: Anti-Hydra Policy
# Configure SPF, DKIM, and DMARC enforcement

def deploy_email_shield():
    spf_record = "v=spf1 ip4:198.51.100.0/24 -all"
    dmarc_policy = "p=reject"
    enforce_mfa = True
    
    if "p=reject" in dmarc_policy and enforce_mfa:
        print("SHIELD ACTIVATED: DMARC Reject + MFA Enforced. Hydra defeated!")
    else:
        print("VULNERABLE: Phishing payload slipped through!")

deploy_email_shield()`,
    solutionSnippet: 'dmarc_policy = "p=reject"\n    enforce_mfa = True',
    hints: [
      'DMARC with p=reject tells mail servers to discard unauthenticated emails outright.',
      'Ensure enforce_mfa is set to True.'
    ],
    byteRoast: "The Hydra is confused. It can't steal passwords that require a cryptographic hardware key!",
    byteSuccess: "HYDRA SHATTERED! All deceptive packets quarantined. Cyber Defense City salutes you!",
    testCases: [
      {
        description: 'Verify DMARC and MFA defense activation',
        expectedOutput: 'SHIELD ACTIVATED: DMARC Reject + MFA Enforced. Hydra defeated!',
      }
    ],
    xpReward: 450,
    creditsReward: 300,
    isBossMission: true,
    badgeReward: 'Zero-Day Shield',
  },

  // ================= NETWORK NEXUS =================
  {
    id: 'network-routing-flow',
    districtId: 'network-nexus',
    title: 'Configure Firewall Port Filtering',
    summary: 'Configure rule table to allow HTTPS (443) and block unauthorized remote access port (4444).',
    storyContext: 'Rogue scanning traffic is hitting port 4444. Update the firewall inspection rule to accept port 443 and drop port 4444.',
    language: 'network',
    concept: 'TCP Ports, Firewalls & Network ACLs',
    starterCode: `# Network Access Control List (ACL)
# Allow port 443 (HTTPS)
# Deny port 4444 (Trojan listener)

rules = {
    443: "ALLOW",
    4444: "DENY"
}

for port, action in rules.items():
    print(f"PORT {port}: {action}")`,
    solutionSnippet: '443: "ALLOW",\n    4444: "DENY"',
    hints: [
      'Port 443 is standard for encrypted web traffic (HTTPS).',
      'Port 4444 is commonly used by backdoor payloads like Metasploit and should be DENIED.'
    ],
    byteRoast: "Leaving port 4444 open is like leaving your front door open with a neon sign saying 'Please Rob Me'.",
    byteSuccess: "Firewall rules applied! Malicious probes bounce off the nexus router like pebbles.",
    testCases: [
      {
        description: 'Validate port rules',
        expectedOutput: 'PORT 443: ALLOW\nPORT 4444: DENY',
      }
    ],
    xpReward: 250,
    creditsReward: 140,
    type: 'network-routing',
  },

  // ================= DATA VAULT =================
  {
    id: 'sql-injection-defense',
    districtId: 'data-vault',
    title: 'Sanitize Guardian Database Query',
    summary: 'Replace raw string concatenation with a parameterized SQL prepared statement.',
    storyContext: 'NULL tried submitting "\' OR 1=1 --" into the login form. Convert the query into a safe parameterized statement!',
    language: 'sql',
    concept: 'SQL Injection Prevention & Prepared Statements',
    starterCode: `-- INSECURE: SELECT * FROM guardians WHERE username = '` + `input_user` + `';
-- SECURE: Use parameterized placeholder (?) to prevent injection

SELECT guardian_id, username, clearance_level 
FROM guardians 
WHERE username = ? AND is_active = 1;`,
    solutionSnippet: 'WHERE username = ?',
    hints: [
      'Prepared statements treat user input as literal data, never executable code.',
      'Using the ? parameter prevents the single-quote exploit.'
    ],
    byteRoast: "Little Bobby Tables strikes again! Sanitize your inputs or watch your entire database evaporate.",
    byteSuccess: "Injection neutralized! The Query King's crown just cracked. Secure data preserved.",
    testCases: [
      {
        description: 'Safe query execution with parameter binding',
        expectedOutput: '[DB_RESULT] Query executed safely via PreparedStatement with bound parameters.',
      }
    ],
    xpReward: 260,
    creditsReward: 160,
    type: 'sql',
  },

  // ================= DEVELOPER METROPOLIS =================
  {
    id: 'dev-boss-null',
    districtId: 'dev-metropolis',
    title: 'FINAL SHOWDOWN: NULL, The Corrupted Architect',
    summary: 'Patch the Cyberverse kernel master exception handler to restore order to the digital universe!',
    storyContext: 'NULL stands at the pinnacle of Developer Metropolis. Its corrupted singularity tries to divide the universe by zero! Write the master try/except block to absorb the singularity and restore balance.',
    language: 'python',
    concept: 'Exception Handling, Resilient Architecture & Victory',
    starterCode: `# FINAL BATTLE: Universal Kernel Exception Handler
# NULL is executing: universe / 0
# Surround with try / except ZeroDivisionError to neutralize the crash!

def neutralize_null():
    universe_state = "CORRUPTED"
    try:
        divide_void = 1 / 0
    except ZeroDivisionError:
        universe_state = "RESTORED"
        print("EXCEPTION HANDLED: Universal Kernel Patched!")
        print("NULL has been cleansed. Cyberverse is SAFE!")

neutralize_null()`,
    solutionSnippet: 'except ZeroDivisionError:\n        universe_state = "RESTORED"',
    hints: [
      'Wrap the risky operation in a try block.',
      'Catch the ZeroDivisionError in the except block and update universe_state to "RESTORED".'
    ],
    byteRoast: "This is it, Guardian! If our exception handler fails, we become floating blue screens. NO PRESSURE.",
    byteSuccess: "THE SINGULARITY COLLAPSED! NULL is pacified! The Cyberverse bursts with neon light and harmony! You are a legendary Cyber Guardian!",
    testCases: [
      {
        description: 'Verify universal exception handling and boss cleansing',
        expectedOutput: 'EXCEPTION HANDLED: Universal Kernel Patched!\nNULL has been cleansed. Cyberverse is SAFE!',
      }
    ],
    xpReward: 1000,
    creditsReward: 1000,
    isBossMission: true,
    badgeReward: 'Savior of the Cyberverse',
  }
];
