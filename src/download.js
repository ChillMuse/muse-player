// Installers from the muse-desktop GitHub release. Update the file names when a new version ships.
const release = 'https://github.com/IanTheMitten/muse-desktop/releases/latest/download';

export const installers = {
  mac: {
    id: 'mac',
    os: 'macos',
    name: 'macOS (Apple Silicon)',
    file: 'Muse_0.1.1_aarch64.dmg',
    url: `${release}/Muse_0.1.1_aarch64.dmg`,
    label: 'Download for macOS'
  },
  'mac-intel': {
    id: 'mac-intel',
    os: 'macos',
    name: 'macOS (Intel)',
    file: 'Muse_0.1.1_x64.dmg',
    url: `${release}/Muse_0.1.1_x64.dmg`,
    label: 'Download for Intel Mac'
  },
  windows: {
    id: 'windows',
    os: 'windows',
    name: 'Windows',
    file: 'Muse_0.1.1_x64-setup.exe',
    url: `${release}/Muse_0.1.1_x64-setup.exe`,
    label: 'Download for Windows'
  }
};

export const download = {
  macOS: { appleSilicon: installers.mac, intel: installers['mac-intel'] },
  windows: installers.windows,
  releases: 'https://github.com/IanTheMitten/muse-desktop/releases',
  source: 'https://github.com/IanTheMitten/muse-desktop'
};

// The thank-you page starts the download and explains the first launch.
export const thanksUrl = item => `./thanks.html?os=${item.id}`;
