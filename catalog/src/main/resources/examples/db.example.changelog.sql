--liquibase formatted sql

--changeset EvgeneyF:devtest1
CREATE TABLE test1 (
  id   INT PRIMARY KEY,
  name VARCHAR(255)
);
--rollback drop table test1;

--changeset EvgeneyF:devtest2
--preconditions onFail:CONTINUE onError:CONTINUE
--precondition-sql-check expectedResult:0 SELECT COUNT(*) FROM test1
INSERT INTO test1 (id, name) VALUES (1, 'User1');
--rollback delete from test1 where id = 1;