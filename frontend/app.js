//--State--
let selectedGrade = 'High School'; // default selected grade, and will change when student picks
let uploadedImageB64 = null;  // stores uploadded image

//--Get HTML Elements--
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
const exerciseText = document.getElementById('exerciseText');
const gradeRow = document.getElementById('gradeRow');
const analyzeBtn = document.getElementById('analyzeBtn');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultsArea = document.getElementById('resultsArea');
const scoreNum = document.getElementById('scoreNum');
const summaryText = document.getElementById('summaryText');
const gapsGrid = document.getElementById('gapsGrid');
const stepsList = document.getElementById('stepsList');
const errorState = document.getElementById('errorState');

//--Gade Selector--
gradeRow.addEventListener('click', function(event) {
    const chip = event.target.closest('.grade-chip');
    if (!chip) return;

    document.querySelectorAll('.grade-chip').forEach(function(btn) {
        btn.classList.remove('active');        
    });

    chip.classList.add('active');
    selectedGrade = chip.dataset.grade;
});

//--Image Upload--
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const dataUrl = e.target.result;
        uploadedImageB64 = dataUrl.split(',')[1]; // Base64 is a way of representing binary files (images) as a text string
        previewImg.src = dataUrl;
        previewImg.style.display = 'block';
        uploadZone.querySelector('p').innerHTML = '<strong>Image ready</strong><br/>Click to cahnge';
    };

    reader.readAsDataURL(file); // starts converting
});

//--Analyze Function--
async function analyze() {                         // this function can wait
    const text = exerciseText.value.trim();

    if(!text && !uploadedImageB64) {
        alert('Please type an exercise or upload an image');
        return;
    }

    showLoading();
    
    try {
        const response = await fetch('http://localhost:8001/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
             },
            body: JSON.stringify({
            exercise: text,
            grade: selectedGrade
            })
        });
        
        if (!response.ok) {
            throw new Error('Server returned ' + response.status);
        }

        const data = await response.json();
        const raw = data.result;
        if (!raw) {
            throw new Error('Missing result from server');
        }
        const clean = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        showResults(parsed)
    } catch(error) {
    console.error(error);
    showError();
  }
}

//--Button Click--
analyzeBtn.addEventListener('click', analyze);

//--Build Messages--
function buildMessages(text, prompt) {
    const userContent = [];

    if(uploadedImageB64) {
        userContent.push( {
            type: 'image',
            source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: uploadedImageB64
            }
        });
    }

    userContent.push({
        type: 'text',
        text: prompt
    });

    return [{
        role: 'user',
        content: userContent
    }];
}
  
//--Show Loading--
function showLoading(){
    emptyState.style.display = 'none';
    errorState.style.display = 'none';
    loadingState.style.display = 'flex';
    resultsArea.style.display = 'none';
    analyzeBtn.disabled = true;
}

//--Show Error--
function showError() {
  loadingState.style.display = 'none';
  analyzeBtn.disabled = false;
  resultsArea.style.display = 'none';
  errorState.style.display = 'flex';
}

//--Show Results--
function showResults(data) {
  loadingState.style.display = 'none';
  errorState.style.display = 'none';
  analyzeBtn.disabled = false;
  resultsArea.style.display = 'flex';

  // Score color - green if perfect, purple otherwise
  scoreNum.style.color = data.score === 100 
    ? 'var(--green)' 
    : 'var(--purple)';
  scoreNum.textContent = data.score;
  summaryText.textContent = data.summary;

  //Build gap cards
  if (data.gaps.length === 0) {
    gapsGrid.innerHTML = `
      <div class="success-card">
        <i class="fa-solid fa-circle-check"></i>
        <p>Great job! No knowledge gaps detected.</p>
      </div>`;
  } else {
    gapsGrid.innerHTML = data.gaps.map(function(gap) {
      return `
        <div class="gap-card ${gap.severity}">
          <div class="gap-top">
            <span class="gap-name">${gap.concept}</span>
            <span class="gap-badge">${gap.severity}</span>
          </div>
          <div class="gap-desc">${gap.description}</div>
          <div class="gap-hint">
            <div class="gap-hint-label">
                <i class="fa-solid fa-lightbulb"></i> How to improve
            </div>
            ${gap.hint}
          </div>
          <div class="gap-example">
            <div class="gap-example-label">
                <i class="fa-solid fa-pen"></i>Example
            </div>
          </div>
          ${gap.example}      
        </div>`;
    }).join('');
  }

  //--Build next steps--
  stepsList.innerHTML = data.nextSteps.map(function(step, index) {
    return `
      <div class="step-item">
        <div class="step-num">${index + 1}</div>
        <div class="step-content">
          <strong>${step.title}</strong>
          ${step.detail}
          <div class="step-exercise">
            <i class="fa-solid fa-pencil"></i> Try this: ${step.exercise}
          </div> 
        </div>
      </div>`;
  }).join('');
}