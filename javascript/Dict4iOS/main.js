//===================================================
// application start:
Application.loadIntoDevice(DEVICE_IPHONE);

Page homePage = new Page("index");

Screen screen = Application.getDeivce().getScreen();

screen.load(homePage);

//===================================================
// home page:
homePage.load(DictionaryOptionView);


//===================================================
// DictionaryOptionView:
DictionaryOptionView.addButtons([prefixWordsOptionButton, rootWordsOptionButton]);
prefixWordsOptionButton.when(
		{"click" : function() {
				Screen.load(PrefixWordsPage);
		}}
);

rootWordsOptionButton.when(
		{"click" : function() {
				Screen.load(RootWordsPage);
		}}
);

//===================================================
// PrefixWordsPage:
PrefixWordsPage
	.add(FilterWordsToolBar)
	.add(PrefixWordsTable);

PrefixWordsTable.wordsData = PrefixWordsDataManager.data();
PrefixWordsTable.showData();

//===================================================
// PrefixWordsDataManager:
PrefixWordsDataManager.readFromWordsList(WordsList);

