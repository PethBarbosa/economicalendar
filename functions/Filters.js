module.exports = { AssetFilter, EventDescriptionFilter};

function AssetFilter(asset, listEvents)
{
    return listEvents.filter(x => x.eventAsset.toUpperCase() == asset.toUpperCase());
}

function EventDescriptionFilter(eventDescription, listEvents)
{
    return listEvents.filter(x => x.eventTitle.toUpperCase().trim() == eventDescription.toUpperCase().trim());
}