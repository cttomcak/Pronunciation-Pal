@REM Run this file from the directory it's currently in to run the python tests, after a fresh server restart!
@REM It has to have the web driver (one already exists for Windows) and a version of selenium less than 4.3 (run "pip3 install selenium==4.2.0")
@REM Watch the output for whether the tests are successful or failing.

@REM echo Simple Word Generation
@REM python ./SimpleWordGeneration.py
@REM echo Multiple Word Generation
@REM python ./MultipleWordGeneration.py
@REM echo Simple Word Deletion
@REM python ./SimpleWordDeletion.py
@REM echo Multiple Word Deletion
@REM python ./MultipleWordDeletion.py
@REM echo Toggle Diagrams
@REM python ./ToggleDiagrams.py
@REM echo Audio Button Exists
@REM python ./AudioButtonExists.py
@REM echo No Auth Header Links
@REM python ./NoAuthHeaderLinks.py
echo Register
python ./Register.py
echo Log In
python ./LogIn.py
echo Log Out
python ./LogOut.py
echo Auth Together
python ./AuthTogether.py
echo Speech Animation
python ./SpeechAnimation.py
echo Profile Favorites
python ./ProfileFavorites.py
echo Main Page Favorites
python ./MainPageFavorites.py
echo Animation Favorites
python ./AnimationFavorites.py
echo Show Words Toggle
python ./ShowWordsToggle.py