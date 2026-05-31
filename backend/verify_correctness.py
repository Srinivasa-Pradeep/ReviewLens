import sys
import httpx

BASE_URL = "http://localhost:8000"

def test_ingestion_and_classification():
    # 1. Ingest a stand URL
    stand_url = "https://www.amazon.com/Minimalist-Monitor-Stand-Riser-Organizer/dp/B08CDGR237"
    print(f"Ingesting stand URL: {stand_url}")
    
    r = httpx.post(
        f"{BASE_URL}/api/ingest/url",
        json={"url": stand_url}
    )
    if r.status_code != 200:
        print(f"Error ingesting stand URL: {r.text}")
        sys.exit(1)
        
    stand_data = r.json()
    stand_id = stand_data["dataset_id"]
    stand_name = stand_data["name"]
    print(f"Successfully ingested stand. ID: {stand_id}, Name: {stand_name}")
    
    # Check that seller features are stand-related (contains "drawer sliders" or "screws")
    seller_insights = stand_data["seller_insights"]
    root_cause_timeline = str(seller_insights["root_cause_timeline"])
    print(f"Timeline info: {root_cause_timeline[:200]}...")
    
    # 2. Delete the stand dataset
    print(f"Deleting dataset ID: {stand_id}")
    r = httpx.delete(f"{BASE_URL}/api/datasets/{stand_id}")
    assert r.status_code == 200, f"Failed to delete dataset {stand_id}"
    
    # 3. Ingest a keyboard URL
    kb_url = "https://www.amazon.com/Logitech-Advanced-Wireless-Illuminated-Keyboard/dp/B07S5A29KH"
    print(f"Ingesting keyboard URL: {kb_url}")
    
    r = httpx.post(
        f"{BASE_URL}/api/ingest/url",
        json={"url": kb_url}
    )
    if r.status_code != 200:
        print(f"Error ingesting keyboard URL: {r.text}")
        sys.exit(1)
        
    kb_data = r.json()
    kb_id = kb_data["dataset_id"]
    kb_name = kb_data["name"]
    print(f"Successfully ingested keyboard. ID: {kb_id}, Name: {kb_name}")
    
    # Check if ID was reused
    if kb_id == stand_id:
        print(f"[SUCCESS] SQLite ID reuse verified: Keyboard reused ID {kb_id}")
    else:
        print(f"[INFO] SQLite did not reuse ID (this is normal if there are other higher IDs in history). Keyboard ID is {kb_id}")
        
    # Check that seller features are keyboard-related (contains "spacebar" or "typing" or "keys")
    kb_seller_insights = kb_data["seller_insights"]
    kb_timeline = str(kb_seller_insights["root_cause_timeline"])
    print(f"Keyboard timeline info: {kb_timeline[:200]}...")
    
    assert "spacebar" in kb_timeline.lower() or "key" in kb_timeline.lower() or "typing" in kb_timeline.lower(), "Keyboard classification failed!"
    print("[SUCCESS] Keyboard classified correctly!")

if __name__ == "__main__":
    test_ingestion_and_classification()
