var TAB_KEY = 9;
var ENTER_KEY = 13;
var SELECT_TEST_TRIGGER_KEY = ENTER_KEY;

var autocompleteItemHasBeenAdded = false;   // we need this in order to know when to clear the add test input



/*------------------------------------------------------------
                        CONSTRUCTOR
--------------------------------------------------------------*/
function SelectAndSort(parentSelector, valueItemSourceArray) {
    //assign properties
    this.ParentSelector = parentSelector;
    this.Source         = CastValueItemArrayToAutoCompleteArray(valueItemSourceArray);

    //assign methods
    this.GetSelectedItemsInput  = GetSelectedItemsInput;
    this.GetFilterInput         = GetFilterInput;
    this.GetRoot                = GetRoot;
    this.ClearFilterInput       = ClearFilterInput;
    this.Reset                  = ResetSelectAndSort;
    this.Enable                 = EnableSelectAndSort;
    this.GetSelectedValues      = GetSelectedValues;
    this.GetSelectedItemsHeader = GetSelectedItemsHeader;
}


/*------------------------------------------------------------
                        MEMBER FUNCTIONS
--------------------------------------------------------------*/
function GetSelectedItemsInput() {
    var retVal = $(this.ParentSelector + ' .selectedItems');
    JQuerySelectorValidation(retVal, 1);
    return $(retVal);
}

function GetFilterInput() {
    var retVal = this.ParentSelector + ' .autoCompleteFilter';
    JQuerySelectorValidation(retVal, 1);
    return $(retVal);
}

function GetRoot() {
    var retVal = this.ParentSelector + ' .selectAndSort';
    JQuerySelectorValidation(retVal, 1);
    return $(retVal);
}

function GetSelectedItemsHeader() {
    var retVal = $(this.ParentSelector + ' .readyToAdd');
    return $(retVal);
}

function ResetSelectAndSort() {
    //@* filter input *@
    this.GetFilterInput().val('');

    //@* selected values *@
    this.GetSelectedItemsInput().empty();

    //@* hide the header *@
    this.GetSelectedItemsHeader().hide();
}

function ClearFilterInput() {
    this.GetFilterInput().val('');
}

function EnableSelectAndSort() {
    this.Reset();
    RegisterSelectAndSortAutocomplete(this);
    RegisterSelectAndSortSorting(this);
}

function GetSelectedValues() {
    var retVal = new Array();

    var selectedItemsList = $(this.GetSelectedItemsInput());

    var counter = 0;
    $(selectedItemsList).children('li').each(function () {
        retVal[counter] = ParseValueItemFromSortableElement(this);
        counter++;
    });

    return retVal;
}


/*------------------------------------------------------------
                        STATIC FUNCTIONS
--------------------------------------------------------------*/
function RegisterSelectAndSortAutocomplete(oSelectAndSort) {

    var target = oSelectAndSort.GetFilterInput();

    target.autocomplete({
        source: oSelectAndSort.Source,
        autoFocus: true,
        delay: 0,
        select: function (event, ui) {
            var oValueItem = new ValueItem(ui.item.value, ui.item.label);
            SelectItem(oValueItem, oSelectAndSort);

            oSelectAndSort.GetSelectedItemsHeader().fadeIn();
        },
        close: function (event, ui) {
            if (autocompleteItemHasBeenAdded == true) {
                oSelectAndSort.ClearFilterInput();
                autocompleteItemHasBeenAdded = false;
            }
        }
    });
}

function RegisterSelectAndSortSorting(oSelectAndSort) {
    $(oSelectAndSort.GetSelectedItemsInput()).sortable();
};

function SelectItem(oValueItem, oSelectAndSort) {
    var newSortable = CreateSortableElement('<li/>', oValueItem.Name)
        .attr('value', oValueItem.Value);
    //RegisterExpandSortableItemOnHover(newSortable);

    $(oSelectAndSort.GetSelectedItemsInput()).append(newSortable);

    autocompleteItemHasBeenAdded = true;

    $(oSelectAndSort.GetFilterInput()).focus();    // dont think we need this (the focus seems to automatically return to the text box, but just in case)
}

function CastValueItemArrayToAutoCompleteArray(valueItemArray) {
    // NOTE : we must convert to a weakly-typed object in order for the AutoComplete widget to be able to read the properties
    //    these properties MUST be explicitly named 'value' and 'label'
    var retVal = new Array();

    if (valueItemArray) {
        var counter = 0;
        $(valueItemArray).each(function () {
            retVal[counter] = {
                value: this.Value,
                label: this.Name
            };
            counter++;
        });
    }

    return retVal;
}

//function RegisterExpandSortableItemOnHover(sortableItem) {
//    //@* TODO : use jQuery live?? *@
//    sortableItem.hover(
//        function () {
//            $(this)
//                .stop()
//                .animate(
//                    {
//                        color: '#0070c3'
//                    },
//                    '500'
//                );
//        },
//        function () {
//            $(this)
//                .stop()
//                .animate(
//                    {
//                        color: '#444444'
//                    },
//                    '0'
//                );
//        }
//    );
//}