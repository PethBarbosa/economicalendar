module.exports = { AssetFilter };

function AssetFilter(asset, listEvents)
{
    return listEvents.listEvents.find(x => x.eventAsset == asset.toUpperCase());
}
