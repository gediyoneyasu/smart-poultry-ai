// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get modal elements
    const companyModal = document.getElementById('companyLoginModal');
    const employeeModal = document.getElementById('employeeLoginModal');
    
    // Get button elements
    const companyLoginBtn = document.getElementById('companyLoginBtn');
    const employeeLoginBtn = document.getElementById('employeeLoginBtn');
    const individualModeBtn = document.getElementById('individualModeBtn');
    
    // Get close buttons
    const closeCompanyBtn = document.querySelector('#companyLoginModal .close');
    const closeEmployeeBtn = document.querySelector('#employeeLoginModal .close-employee');
    
    // ========== COMPANY LOGIN BUTTON - FIXED ==========
    // This shows the company login form when clicked
    if (companyLoginBtn) {
        companyLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Company login button clicked - showing form');
            companyModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // ========== EMPLOYEE LOGIN BUTTON ==========
    if (employeeLoginBtn) {
        employeeLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Employee login button clicked - showing form');
            employeeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // ========== INDIVIDUAL MODE BUTTON ==========
    if (individualModeBtn) {
        individualModeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Individual mode selected');
            // You can add individual mode logic here
            alert('Welcome to Individual Farmer Mode! Full features coming soon.');
        });
    }
    
    // ========== CLOSE MODAL FUNCTIONS ==========
    // Close company modal
    if (closeCompanyBtn) {
        closeCompanyBtn.addEventListener('click', function() {
            companyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Clear form fields when closing
            document.getElementById('companyLoginForm').reset();
        });
    }
    
    // Close employee modal
    if (closeEmployeeBtn) {
        closeEmployeeBtn.addEventListener('click', function() {
            employeeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('employeeLoginForm').reset();
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === companyModal) {
            companyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('companyLoginForm').reset();
        }
        if (e.target === employeeModal) {
            employeeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('employeeLoginForm').reset();
        }
    });
    
    // ========== FORM SUBMISSION HANDLERS ==========
    // Company login form submission
    const companyForm = document.getElementById('companyLoginForm');
    if (companyForm) {
        companyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('companyEmail').value;
            const password = document.getElementById('companyPassword').value;
            const companyCode = document.getElementById('companyCode').value;
            
            console.log('Company login attempt:', { email, companyCode });
            
            // Here you would typically make an API call to your backend
            alert(`Welcome back ${email}!\nCompany portal login successful.\nRedirecting to dashboard...`);
            
            // Close modal after successful login
            companyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // You can redirect to company dashboard here
            // window.location.href = '/company-dashboard.html';
            
            // Reset form
            this.reset();
        });
    }
    
    // Employee login form submission
    const employeeForm = document.getElementById('employeeLoginForm');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const employeeId = document.getElementById('employeeId').value;
            const password = document.getElementById('employeePassword').value;
            const companyName = document.getElementById('companyName').value;
            
            console.log('Employee login attempt:', { employeeId, companyName });
            
            // Here you would typically make an API call to your backend
            alert(`Welcome Employee ${employeeId}!\nLogin to ${companyName} successful.\nRedirecting to employee portal...`);
            
            // Close modal after successful login
            employeeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // You can redirect to employee dashboard here
            // window.location.href = '/employee-dashboard.html';
            
            // Reset form
            this.reset();
        });
    }
    
    // Prevent modal content clicks from closing the modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Add keyboard support (ESC to close modals)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (companyModal.style.display === 'block') {
                companyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.getElementById('companyLoginForm').reset();
            }
            if (employeeModal.style.display === 'block') {
                employeeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.getElementById('employeeLoginForm').reset();
            }
        }
    });
    
    console.log('Application initialized - Company login button is working!');
});
