@REM Run this file from the directory it's currently in to run the python tests, after a fresh server restart!
@REM It has to have the web driver (one already exists for Windows) and a version of selenium less than 4.3 (run "pip3 install selenium==4.2.0")
@REM Watch the output for whether the tests are successful or failing.

echo Simple Word Generation
python ./SimpleWordGeneration.py
echo Multiple Word Generation
python ./MultipleWordGeneration.py
echo Simple Word Deletion
python ./SimpleWordDeletion.py
echo Multiple Word Deletion
python ./MultipleWordDeletion.py
echo Toggle Diagrams
python ./ToggleDiagrams.py
echo Audio Button Exists
python ./AudioButtonExists.py
echo No Auth Header Links
python ./NoAuthHeaderLinks.py
echo Register
python ./Register.py
echo Log Out
python ./LogOut.py
echo Log In
python ./LogIn.py
echo Log Out Copy
python ./LogOutCopy.py
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