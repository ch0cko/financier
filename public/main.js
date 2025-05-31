document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const plusBtn = document.getElementById('plusBtn');
const bottomPanel = document.getElementById('bottomPanel');
const overlay = document.getElementById('overlay');
const goalInputsContainer = document.getElementById('goalInputsContainer');
const addGoalInputBtn = document.getElementById('addGoalInputBtn');
const submitGoalsBtn = document.getElementById('submitGoalsBtn');
const stickyNotesContainer = document.getElementById('stickyNotesContainer');
const profileDisplayUsername = document.getElementById('profileDisplayUsername');
const profileDisplayEmail = document.getElementById('profileDisplayEmail');

function closeAllPanels() {
  sidebar.classList.remove('active');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');

  bottomPanel.classList.remove('active');
  plusBtn.classList.remove('active');
  plusBtn.setAttribute('aria-expanded', 'false');

  overlay.classList.remove('active');
}

function toggleSidebar() {
  const isActive = !sidebar.classList.contains('active');
  if (isActive) {
    closeAllPanels();
    sidebar.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
  } else {
    closeAllPanels();
  }
}

function toggleBottomPanel() {
  const isActive = !bottomPanel.classList.contains('active');
  if (isActive) {
    closeAllPanels();
    bottomPanel.classList.add('active');
    plusBtn.classList.add('active');
    plusBtn.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
  } else {
    closeAllPanels();
  }
}

hamburger.addEventListener('click', toggleSidebar);
plusBtn.addEventListener('click', toggleBottomPanel);
overlay.addEventListener('click', closeAllPanels);

// Fetch and display current user info in sidebar
async function fetchAndDisplayUserInfo() {
  try {
    const response = await fetch('/current');
    if (response.ok) {
      const user = await response.json();
      profileDisplayUsername.textContent = 'Name: ' + user.name;
      profileDisplayEmail.textContent = 'Email: ' + user.email;
    } else {
      profileDisplayUsername.textContent = 'Name: (not logged in)';
      profileDisplayEmail.textContent = 'Email: (not logged in)';
    }
  } catch (error) {
    profileDisplayUsername.textContent = 'Name: (error)';
    profileDisplayEmail.textContent = 'Email: (error)';
  }
}

// Add new goal input field
addGoalInputBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control mb-2 goal-input';
  input.placeholder = 'Enter text here';
  goalInputsContainer.appendChild(input);
});

submitGoalsBtn.addEventListener('click', async () => {
  const inputs = document.querySelectorAll('.goal-input');
  const goals = [];
  inputs.forEach(input => {
    if (input.value.trim() !== '') {
      goals.push(input.value.trim());
    }
  });
  if (goals.length === 0) {
    alert('Please enter at least one goal.');
    return;
  }
  try {
    const response = await fetch('/goalsetup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goals }),
    });
    if (response.ok) {
      alert('Goals saved successfully!');
      closeAllPanels();
      clearGoalInputs();
      fetchAndRenderStickyNotes();
    } else {
      const error = await response.json();
      alert('Error saving goals: ' + error.error);
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
});

function clearGoalInputs() {
  goalInputsContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control mb-2 goal-input';
    input.placeholder = 'Enter text here';
    goalInputsContainer.appendChild(input);
  }
}

// Render sticky notes in main content
function renderStickyNotes(goals) {
  stickyNotesContainer.innerHTML = '';
  goals.forEach(goal => {
    const note = document.createElement('div');
    note.className = 'sticky-note p-3 rounded shadow-sm';
    note.style.position = 'relative';
    note.title = 'Sticky note';

    // Create delete button as span
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'sticky-note-delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete sticky note';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        const response = await fetch('/goalsetup/' + goal._id, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Sticky note deleted');
          fetchAndRenderStickyNotes();
        } else {
          const error = await response.json();
          alert('Error deleting sticky note: ' + error.error);
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    });
    note.appendChild(deleteBtn);

    // Render all texts inside the sticky note
    goal.texts.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      note.appendChild(p);
    });

    stickyNotesContainer.appendChild(note);
  });
}

function showStickyNoteModal(goal) {
  console.log('showStickyNoteModal called for goal:', goal._id);
  // Create modal elements
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal bg-white p-4 rounded shadow-lg';

  // Render all texts inside modal
  goal.texts.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    modal.appendChild(p);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger mt-3';
  deleteBtn.textContent = 'Delete';

  deleteBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/goalsetup/' + goal._id, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Sticky note deleted');
        document.body.removeChild(modalOverlay);
        fetchAndRenderStickyNotes();
      } else {
        const error = await response.json();
        alert('Error deleting sticky note: ' + error.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  });

  modal.appendChild(deleteBtn);
  modalOverlay.appendChild(modal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  document.body.appendChild(modalOverlay);
}

// Fetch goals from backend and render sticky notes
async function fetchAndRenderStickyNotes() {
  try {
    const response = await fetch('/goalsetup');
    if (response.ok) {
      const goals = await response.json();
      window.goalsData = goals; // store globally for modal lookup
      renderStickyNotes(goals);
    } else {
      alert('Error fetching sticky notes');
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
}

// Fetch goals from backend and render sticky notes
async function fetchAndRenderStickyNotes() {
  try {
    const response = await fetch('/goalsetup');
    if (response.ok) {
      const goals = await response.json();
      renderStickyNotes(goals);
    } else {
      alert('Error fetching sticky notes');
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
}
  clearGoalInputs();
  fetchAndRenderStickyNotes();
  fetchAndDisplayUserInfo();
});
