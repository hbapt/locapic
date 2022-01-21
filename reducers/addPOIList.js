export default function (listPOI = [], action) {
    if (action.type == 'addPOIList') {
        return action.listPOI;
    } else if (action.type == 'deletePOI') {
        // var listPOICopy = [...listPOI]
        var newArr = listPOI.filter(poi => poi !== action.poi)

        return newArr;
    } else {
        return listPOI;
    }
}