package com.advantage.catalog.store.image;

import java.io.IOException;

public interface ManagedImage {

    ImageManagement getImageManagement();

    String getId();

    String getType();

    String getManagedFileName();

    String getManagedMobileFileName();

    String getOriginalFileName();

    byte[] getContent() throws IOException;

    byte[] getMobileContent() throws IOException;
}