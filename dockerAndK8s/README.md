### K8S

#### Components https://kubernetes.io/docs/concepts/overview/components/

#### Installing MiniKube https://kubernetes.io/docs/setup/learning-environment/minikube/

- start and stop the cluster

  > minikube start

  > minikube stop

- cluster-info

  > kubectl cluster-info

- --help

  > kubectl create --help

- get all objects

  > kubectl get all

#### Node

- get

  > kubectl get nodes

#### Pod

A Pod encapsulates an application’s container (or, in some cases, multiple containers), storage resources, a unique network identity (IP address), as well as options that govern how the container(s) should run

pod-definition.yml

```yml
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "foo-pod"
  labels: # Any Arbitrary key value pair
    app: "foo"
    type: "front-end"
spec:
  containers:
    - name: "redis"
      image: "redis:latest"
```

- create

  > kubectl create -f pod-definition.yml

- run

  > kubectl run POD_NAME --image=POD_IMAGE

- get

  > kubectl get pods -o wide # Retrieves NODE and IP as well

- describe

  > kubectl describe pod

  > kubectl describe pod foo-pod

- delete

  > kubectl delete pod redis

### ReplicationController and ReplicaSet

A ReplicaSet and ReplicationController is defined with fields, including a selector(selector is not required in replication controller) that specifies how to identify Pods it can acquire, a number of replicas indicating how many Pods it should be maintaining, and a pod template specifying the data of new Pods it should create to meet the number of replicas criteria. A ReplicaSet then fulfills its purpose by creating and deleting Pods as needed to reach the desired number. When a ReplicaSet needs to create new Pods, it uses its Pod **template**.

**replicationController-definition**.yml

```yml
apiVersion: "v1" # ReplicationController is the old one
kind: "ReplicationController"
metadata:
  name: "foo-rc"
  labels:
    app: "foo"
    type: "front-end"
spec:
  template:
    metadata:
      name: "foo-pod"
      labels:
        app: "foo"
        type: "front-end"
    spec:
      containers:
        - name: "redis"
          image: "redis:latest"
  replicas: 3
  selector: # Not required in ReplicationController
    matchLabels:
      type: "front-end"
```

**replicaSet-definition**.yml

```yml
apiVersion: "apps/v1"
kind: "ReplicaSet"
metadata:
  name: "foo-replicaset"
  labels:
    app: "foo"
    type: "front-end"
spec:
  template:
    metadata:
      name: "foo-pod"
      labels:
        app: "foo"
        type: "front-end"
    spec:
      containers:
        - name: "redis"
          image: "redis:latest"
  replicas: 3
  selector:
    matchLabels:
      type: "front-end"
```

- create

  > kubectl create -f rc-definition.yml

- get

  > kubectl get replicationController

  > kubectl get replicaset

- describe

  > kubectl describe replicaset

- delete

  > kubectl delete replicaset foo-replicaset

#### Scale replication

In order to change(increase/decrease) the number of replication consider one the following methods:

- Change the `replicas` field on rc-definition.yml then run:

  > kubectl replace rc-definition.yml

- scale

  > kubectl scale --replicas=6 -f rc-definition.yml

  > kubectl scale --replicas=6 replicaset foo-replicaSet
