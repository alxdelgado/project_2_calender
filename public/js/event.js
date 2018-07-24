console.log('Javascript is linked');

const $button = $('#addPerson');
const $personDiv = $('#personDiv');
const $allDay = $('#allDay');
const $personIndex = $('#personIndex');
const $end = $('.end');

//check if all day is checked or not
if($allDay.is(':checked')) {
	//if checked, then hide all end options
	$end.hide();
} else {
	//if not checked, show all end options
	$end.show();
}


let index = $personIndex.val();

$button.on('click', (event) => {
	//prevent button from submitting the form
	event.preventDefault();
	index++;

	//add new input with a new name of person/Index
	const $input = $(`<input type="text" name="person[]" placeholder="Add Attendee" autofocus><br>`);

	//add the new input to the personDiv
	$personDiv.append($input);
	$personIndex.val(index);
})

//event listener on all day checkbox
$allDay.on('click', (event) => {

	//check if all day is checked
	if($allDay.is(':checked')) {
		//if checked, then hide all the end options
		$end.hide();
	} else {
		//if not checked, show all the end options
		$end.show();
	}
})