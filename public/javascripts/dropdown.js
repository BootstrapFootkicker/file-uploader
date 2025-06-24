// Handle dropdown menu toggling
document.addEventListener('click', event => {
  const isDropdownToggle = event.target.matches('[data-dropdown-button]');
  let activeDropdown;

  if (isDropdownToggle) {
    activeDropdown = event.target.closest('[data-dropdown]');
    activeDropdown.classList.toggle('active');
  }

  // Close other open dropdowns
  document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
    if (dropdown === activeDropdown) return;
    dropdown.classList.remove('active');
  });
});