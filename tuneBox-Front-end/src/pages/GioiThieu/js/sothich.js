const categoryButtons = document.querySelectorAll('.btn-category');
                    
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle the 'active' class for the button
        button.classList.toggle('active');
    });
});