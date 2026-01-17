// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // -------------------------
    // SCREEN ELEMENTS
    // -------------------------
    const welcomeScreen = document.getElementById("welcomeScreen");
    const signupScreen = document.getElementById("signupScreen");
    const homeScreen = document.getElementById("homeScreen");
    const subjectsScreen = document.getElementById("subjectsScreen");
    const chatScreen = document.getElementById("chatScreen");
    const clubsScreen = document.getElementById("clubsScreen");
    const assignmentsScreen = document.getElementById("assignmentsScreen");

    const overlay = document.getElementById("overlay");
    const addFriendModal = document.getElementById("addFriendModal");

    // -------------------------
    // BUTTONS
    // -------------------------
    const startBtn = document.getElementById("startBtn");
    const signupForm = document.getElementById("signupForm");

    const categoriesBtn = document.getElementById("categoriesBtn");
    const chatBtn = document.getElementById("chatBtn");
    const clubsBtn = document.getElementById("clubsBtn");
    const assignmentsBtn = document.getElementById("assignmentsBtn");

    const backBtns = document.querySelectorAll(".back-btn");
    const modalCloseBtns = document.querySelectorAll(".close-modal");

    // -------------------------
    // HELPER FUNCTION
    // -------------------------
    function showScreen(screen) {
        // Hide all screens
        const allScreens = document.querySelectorAll(".screen");
        allScreens.forEach(s => s.classList.remove("active"));

        // Show the target screen
        screen.classList.add("active");
    }

    // -------------------------
    // START BUTTON (WELCOME → SIGNUP)
    // -------------------------
    startBtn.addEventListener("click", function() {
        showScreen(signupScreen);
    });

    // -------------------------
    // SIGNUP FORM SUBMIT (SIGNUP → HOME)
    // -------------------------
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent page reload
        showScreen(homeScreen);
    });

    // -------------------------
    // HOME BUTTONS
    // -------------------------
    categoriesBtn.addEventListener("click", function() {
        showScreen(subjectsScreen);
    });

    chatBtn.addEventListener("click", function() {
        showScreen(chatScreen);
    });

    clubsBtn.addEventListener("click", function() {
        showScreen(clubsScreen);
    });

    assignmentsBtn.addEventListener("click", function() {
        showScreen(assignmentsScreen);
    });

    // -------------------------
    // BACK BUTTONS
    // -------------------------
    backBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Find parent screen of this button
            const parentScreen = btn.closest(".screen");

            // If it's home-screen-level, go back to home
            if (parentScreen === homeScreen) return;

            showScreen(homeScreen);
        });
    });

    // -------------------------
    // MODAL CLOSE BUTTONS
    // -------------------------
    modalCloseBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            addFriendModal.style.display = "none";
            overlay.style.display = "none";
        });
    });

    // -------------------------
    // OVERLAY CLICK (close modal)
    // -------------------------
    overlay.addEventListener("click", function() {
        addFriendModal.style.display = "none";
        overlay.style.display = "none";
    });

    // -------------------------
    // EXAMPLE: OPEN ADD FRIEND MODAL
    // -------------------------
    // Later you can attach this to any button you want
    // Example: open when chat screen is active
    // const openModalBtn = document.getElementById("openModalBtn");
    // openModalBtn.addEventListener("click", function() {
    //     addFriendModal.style.display = "block";
    //     overlay.style.display = "block";
    // });
});
