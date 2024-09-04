// renderer.mjs
document.getElementById('openLinkButton').addEventListener('click', () => {
    console.log('Button clicked');
    window.electronAPI.openLink('https://www.example.com');
  });
  