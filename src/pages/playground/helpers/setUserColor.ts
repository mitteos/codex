export const setUserColor = (clientId: string, color: string) => {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `
            .yRemoteSelection-${clientId} {
              background-color: ${color};
            }
            .yRemoteSelectionHead {
              position: absolute;
              border-left: ${color} solid 2px;
              border-top: ${color} solid 2px;
              border-bottom: ${color} solid 2px;
              height: 100%;
              box-sizing: border-box;
            }
            .yRemoteSelectionHead::after {
              position: absolute;
              content: ' ';
              border: 3px solid ${color};
              border-radius: 4px;
              left: -4px;
              top: -5px;
            }

          `
  document.head.appendChild(styleElement)
}
