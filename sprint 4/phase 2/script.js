var API_KEY = "your API key";
// ─────────────────────────────────────────────────────────

function simulateLetter(name, role, company, skills) {
  return `Dear Hiring Manager at ${company},

I am writing to apply for the ${role} position at ${company}. My name is ${name}, and I am excited about this opportunity.

My key skills include ${skills}. I believe these make me a strong fit for the ${role} role and I am confident I can contribute meaningfully to your team at ${company}.

I am eager to bring my abilities to ${company} and grow alongside your team. Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}`;
}

async function generateLetter() {

  var name    = document.getElementById("name").value.trim();
  var role    = document.getElementById("role").value.trim();
  var company = document.getElementById("company").value.trim();
  var skills  = document.getElementById("skills").value.trim();


  if (name === "" || role === "" || company === "" || skills === "") {
    alert("Please fill in all the fields!");
    return;
  }

  document.getElementById("placeholder-text").style.display = "none";
  document.getElementById("output").style.display           = "none";
  document.getElementById("error-text").style.display       = "none";
  document.getElementById("loading").style.display          = "block";
  document.getElementById("generateBtn").disabled           = true;
  document.getElementById("generateBtn").textContent        = "Generating...";

  var prompt = `Write a professional cover letter for the following person:

- Name: ${name}
- Applying for: ${role}
- At company: ${company}
- Key skills: ${skills}

Instructions:
- Keep it under 250 words
- Use a formal but friendly tone
- Start with "Dear Hiring Manager at ${company},"
- End with "Sincerely, ${name}"
- Do NOT add any extra commentary, just the letter itself`;

  var letter = "";

  if (API_KEY === "your api key" || API_KEY === "") {
    // Phase 1 fallback — use the template string controller
    letter = simulateLetter(name, role, company, skills);
    showLetter(letter);
    return;
  }

  try {
    var response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      })
    });

    var data = await response.json();

    if (!data.choices) {
      throw new Error(data.error ? data.error.message : "No response from Groq.");
    }

    letter = data.choices[0].message.content;
    showLetter(letter);

  } catch (err) {
    document.getElementById("loading").style.display    = "none";
    document.getElementById("error-text").style.display = "block";
    document.getElementById("error-text").textContent   = "Error: " + err.message;

    document.getElementById("generateBtn").disabled     = false;
    document.getElementById("generateBtn").textContent  = "Generate Letter";
  }
}


function showLetter(letter) {
  document.getElementById("loading").style.display      = "none";
  document.getElementById("output").style.display       = "block";
  document.getElementById("letter-text").textContent    = letter;
  document.getElementById("generateBtn").disabled       = false;
  document.getElementById("generateBtn").textContent    = "Generate Letter";
}


function copyLetter() {
  var text = document.getElementById("letter-text").textContent;
  navigator.clipboard.writeText(text).then(function() {
    var toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(function() { toast.classList.remove("show"); }, 2000);
  });
}
