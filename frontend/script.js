const API = "https://studybuddy-lnsx.onrender.com";
// ================= AUTH =================

// REGISTER
async function register() {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const subjects =
    document.getElementById("subjects")
      .value
      .split(",")
      .map(s => s.trim());

  const skillLevel =
    document.getElementById("skillLevel").value;

  const availability =
    document.getElementById("availability")
      .value
      .split(",")
      .map(a => a.trim());

  const res = await fetch(
    `${API}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        subjects,
        skillLevel,
        availability
      })
    }
  );

  const data = await res.json();

  if (res.ok) {
    alert("Registered Successfully");
    window.location = "index.html";
  } else {
    alert(data.message || "Registration Failed");
  }
}

// LOGIN
async function login() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const res = await fetch(
    `${API}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await res.json();

  if (!data.token) {
    alert("Login Failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("name", data.name);

  localStorage.setItem(
    "subjects",
    JSON.stringify(data.subjects)
  );

  localStorage.setItem(
    "skillLevel",
    data.skillLevel
  );

  localStorage.setItem(
    "availability",
    JSON.stringify(data.availability)
  );

  alert("Login Successful");

  window.location = "dashboard.html";
}

// LOGOUT
function logout() {

  localStorage.clear();

  window.location = "index.html";
}

// ================= GROUPS =================

// CREATE GROUP
async function createGroup() {

  const name =
    document.getElementById("gname").value;

  const subject =
    document.getElementById("subject").value;

  const level =
    document.getElementById("level").value;

  const availability =
    document.getElementById("availability")
      .value
      .split(",")
      .map(a => a.trim());

  const maxMembers =
    document.getElementById("maxMembers").value;

  const res = await fetch(
    `${API}/api/groups/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      },
      body: JSON.stringify({
        name,
        subject,
        level,
        availability,
        maxMembers
      })
    }
  );

  const data = await res.json();

  console.log(data);

  alert("Group Created");

  loadGroups();
}

// LOAD ALL GROUPS
async function loadGroups() {

  const token =
    localStorage.getItem("token");

  if (!token) {
    window.location = "index.html";
    return;
  }

  const res = await fetch(
    `${API}/api/groups`,
    {
      headers: {
        Authorization:
          "Bearer " + token
      }
    }
  );

  const groups = await res.json();

  const groupList =
    document.getElementById("groupList");

  if (!groupList) return;

  groupList.innerHTML = "";

  groups.forEach(g => {

    const div =
      document.createElement("div");

    div.className = "group-card";

div.innerHTML = `
  <h3>${g.name}</h3>

  <p>Subject: ${g.subject}</p>

  <p>Level: ${g.level}</p>

  <p>
    Availability:
    ${g.availability?.join(", ") || ""}
  </p>

  <p>
    Members:
    ${g.members.length}/${g.maxMembers}
  </p>

<button onclick="joinGroup('${g._id}')">
  Join Group
</button>

${
  g.isMember
    ? `
      <button
        onclick="openChat('${g._id}')">
        Open Chat
      </button>
    `
    : ""
}

${
  g.isAdmin
    ? `
      <button
        onclick="deleteGroup('${g._id}')">
        Delete Group
      </button>
    `
    : ""
}
`;
    groupList.appendChild(div);

  });

}

// JOIN GROUP
async function joinGroup(id) {

  const res = await fetch(
    `${API}/api/groups/join/${id}`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      }
    }
  );

  const data = await res.json();

  alert(data.message);

  loadGroups();
}

function openChat(id) {

  localStorage.setItem("groupId", id);

  window.location = "chat.html";

}
async function loadMyGroups() {

  const res = await fetch(
    `${API}/api/groups/mygroups`,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      }
    }
  );

  const groups = await res.json();

  const myGroups =
    document.getElementById("myGroups");

  if (!myGroups) return;

  myGroups.innerHTML = "";

  groups.forEach(g => {

    myGroups.innerHTML += `
      <div class="group-card">

        <h4>${g.name}</h4>

        <p>${g.subject}</p>

        <button
          onclick="openChat('${g._id}')">
          Open Chat
        </button>

      </div>
    `;
  });
}

// ================= MATCHING =================

async function loadRecommendedGroups() {

  const res = await fetch(
    `${API}/api/groups/recommended`,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      }
    }
  );

  const groups = await res.json();

  const results =
    document.getElementById("results");

  if (!results) return;

  results.innerHTML = "";

  groups.forEach(g => {

    results.innerHTML += `
      <div class="group-card">

        <h3>${g.name}</h3>

        <p>
          Subject:
          ${g.subject}
        </p>

        <p>
          Level:
          ${g.level}
        </p>

        <p>
          Availability:
          ${g.availability?.join(", ")}
        </p>

        <button
          onclick="joinGroup('${g._id}')">
          Join
        </button>

      </div>
    `;
  });

}

async function loadDashboardStats() {

  const res = await fetch(
    `${API}/api/groups/mygroups`,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      }
    }
  );

  const groups = await res.json();

  const groupsJoined =
    document.getElementById("groupsJoined");

  if (groupsJoined) {
    groupsJoined.innerText =
      `Groups Joined: ${groups.length}`;
  }
}

async function deleteGroup(id) {

  const confirmDelete =
    confirm("Delete this group?");

  if (!confirmDelete) return;

  const res = await fetch(
    `${API}/api/groups/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token")
      }
    }
  );

  const data = await res.json();

  alert(data.message);

  loadGroups();
}
// ================= AUTO LOAD =================

window.onload = () => {

  if (document.getElementById("groupList")) {
    loadGroups();
  }

  if (document.getElementById("results")) {
    loadRecommendedGroups();
  }

  if (document.getElementById("groupsJoined")) {
    loadDashboardStats();
  }
  if (document.getElementById("myGroups")) {
  loadMyGroups();
}

};
