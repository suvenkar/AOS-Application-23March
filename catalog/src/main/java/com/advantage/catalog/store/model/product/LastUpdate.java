package com.advantage.catalog.store.model.product;

import javax.persistence.*;

/**
 * @author Binyamin Regev on 16/03/2016.
 */
@Entity
@Table(name = "last_update")
@NamedQueries({
        @NamedQuery(
                name = LastUpdate.QUERY_GET_ALL,
                query = "select l from LastUpdate l"
                ),
        @NamedQuery(
                name = LastUpdate.QUERY_LAST_UPDATE_BY_NAME,
                query = "select l from LastUpdate l where UPPER(l.lastUpdateName) = :luname"
        )
})
public class LastUpdate {
    public static final String QUERY_GET_ALL = "last_update.getAll";
    public static final String QUERY_LAST_UPDATE_BY_NAME = "last_update.getLastUpdateByName";

    public static final String FIELD_ID = "last_update_id";
    public static final String FIELD_NAME = "last_update_name";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = FIELD_ID)
    private Long lastUpdateId;
    @Column(name = FIELD_NAME, length=50, nullable=false)
    private String lastUpdateName;
    @Column
    private long lastUpdate;

    public LastUpdate() {
    }

    public LastUpdate(String lastUpdateName, long lastUpdate) {
        this.lastUpdateName = lastUpdateName;
        this.lastUpdate = lastUpdate;
    }

    public Long getLastUpdateId() {
        return lastUpdateId;
    }

    public String getLastUpdateName() {
        return lastUpdateName;
    }

    public void setLastUpdateName(String lastUpdateName) {
        this.lastUpdateName = lastUpdateName;
    }

    public long getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(long lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LastUpdate that = (LastUpdate) o;

        if (getLastUpdate() != that.getLastUpdate()) return false;
        if (!getLastUpdateId().equals(that.getLastUpdateId())) return false;
        return getLastUpdateName().equals(that.getLastUpdateName());

    }

    @Override
    public int hashCode() {
        int result = getLastUpdateId().hashCode();
        result = 31 * result + getLastUpdateName().hashCode();
        result = 31 * result + (int) (getLastUpdate() ^ (getLastUpdate() >>> 32));
        return result;
    }
}
