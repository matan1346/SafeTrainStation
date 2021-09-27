from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

ENTRY = "Alert"
CHANNEL = "detection-channel"
the_update = None

pnconfig = PNConfiguration()
pnconfig.publish_key = "PUBLISH KEY"
pnconfig.subscribe_key = "SUBSCRIBE KEY"
pnconfig.uuid = "serverUUID-PUB"

pubnub = PubNub(pnconfig)


def publish_alert(data):
    envelope = pubnub.publish().channel(CHANNEL).message(data).sync()

    if envelope.status.is_error():
        print("[PUBLISH: fail]")
        print("error: %s" % envelope.status.error)
    else:
        print("[PUBLISH: sent]")
        print("timetoken: %s" % envelope.result.timetoken)
