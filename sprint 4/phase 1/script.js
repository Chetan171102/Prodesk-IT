
function generateLetter() {
  var name    = document.getElementById("name").value.trim();
  var role    = document.getElementById("role").value.trim();
  var company = document.getElementById("company").value.trim();
  var skills  = document.getElementById("skills").value.trim();

  if (name === "" || role === "" || company === "" || skills === "") {
    alert("Please fill in all the fields!");
    return;
  }
  var letter =
`Dear Hiring Manager at ${company},

I am writing to apply for the ${role} position at ${company}. My name is ${name}, and I am excited about this opportunity.

My key skills include ${skills}. I believe these make me a strong fit for the ${role} role and I am confident I can contribute meaningfully to your team at ${company}.

I am eager to bring my abilities to ${company} and grow alongside your team. Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}`;
 
  document.getElementById("placeholder-text").style.display = "none";
  document.getElementById("output").style.display = "block";
  document.getElementById("letter-text").textContent = letter;
}

function copyLetter() {
  var text = document.getElementById("letter-text").textContent;

  navigator.clipboard.writeText(text).then(function() {
    var toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(function() {
      toast.classList.remove("show");
    }, 2000);
  });
}
