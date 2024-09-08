!macro customInstall
  CreateDirectory "$SMSTARTUP"
  CreateShortCut "$SMSTARTUP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  
  ${If} ${SectionIsSelected} ${SC_START_MENU}
    !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    CreateShortCut "$SMPROGRAMS\$START_MENU_FOLDER\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
    !insertmacro MUI_STARTMENU_WRITE_END
  ${EndIf}
!macroend

!macro customInstallMode
  !insertmacro INSTALLOPTIONS_EXTRACT "autostart.ini"
  !insertmacro INSTALLOPTIONS_DISPLAY "autostart.ini"
!macroend