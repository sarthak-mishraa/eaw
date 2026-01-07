// ================= AUTH CHECK =================
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
  window.location.href = "index.html";
}

// ================= BACKEND BASE =================
const PROFILE_API = "https://eaw.onrender.com/api/profile";

// ================= QR GENERATION =================
function generateQR() {
  const name = document.getElementById("name").value.trim();
  const blood = document.getElementById("blood").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const relationship = document.getElementById("relationship").value.trim();
  const address = document.getElementById("address").value.trim();
  const conditions = document.getElementById("conditions").value.trim();
  const allergies = document.getElementById("allergies").value.trim();
  const suggestions = document.getElementById("suggestions").value.trim();

  if (!name || !blood || !contact || !relationship) {
    alert("Required fields missing");
    return;
  }

  if (!/^\d{10}$/.test(contact)) {
    alert("Contact must be 10 digits");
    return;
  }

  const qrText = `
Name: ${name}
Blood Group: ${blood}
Contact: ${contact} (${relationship})
Address: ${address}
Conditions: ${conditions}
Allergies: ${allergies}
Suggestions: ${suggestions}
`.trim();

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: qrText,
    width: 220,
    height: 220
  });

  document.getElementById("downloadBtn").style.display = "inline-block";

  // ================= SAVE PROFILE TO BACKEND =================
  fetch(`${PROFILE_API}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      bloodGroup: blood,
      allergies,
      medicalConditions: conditions,
      emergencyContactName: name,
      emergencyContactRelationship: relationship,
      emergencyContactPhone: contact,
      suggestions
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Profile save failed");
      return res.json();
    })
    .then(() => console.log("Profile saved"))
    .catch(err => console.error(err));
}

// ================= DOWNLOAD QR =================
function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return alert("Generate QR first");

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "EmergencyQR.png";
  link.click();
}
