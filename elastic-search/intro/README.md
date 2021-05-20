## [What Is Elastic Search](https://knowi.com/blog/what-is-elastic-search)

### Elastic Search Back end components

- Cluster: Group of nodes that connected together, And distributes tasks search and etc across nodes 

- Nodes: Part of the cluster which is responsible for indices and search capabilities. There is 3 diffract kinds of elastic search nodes:

	- Master: Manages cluster-wide operations such as adding or removing nodes or create or deleting indices

	- Data: Store and execute data-related ops such as search and aggregation

	- Client: Forwards cluster requests to master and data-related requests to data nodes

- Shards: Subdivided indices that are independent that each one can hosted individually within a node. Having this component this place could protects against hardware failures and increase query capability

- Replicas: Copy of the shard indices. By providing data redundancy, replicas will protect against hardware failures and increases search read requests capabilities


