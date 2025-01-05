import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NetworkMode } from 'aws-cdk-lib/aws-ecr-assets';

export class EcsIssueStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc = new ec2.Vpc(this, 'MyVpc2', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'MyCluster2', {
      vpc: vpc,
    });

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'MyAutoScalingGroup', {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      desiredCapacity: 1,
      minCapacity: 1,
      maxCapacity: 3,
    });

    const accessRole = true;


    const capacityProvider = new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: accessRole,
      capacityProviderName: "testEcsProviderName",
    });

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: true,
      capacityProviderName: "testEcsProviderName",
    });

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: false,
      capacityProviderName: "testEcsProviderName",
    });

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      capacityProviderName: "testEcsProviderName",
    });

    const prop1 = {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: true,
      capacityProviderName: "testEcsProviderName",
    }

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', prop1);

    const prop2 = {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: false,
      capacityProviderName: "testEcsProviderName",
    }

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', prop2);

    const prop3 = {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      capacityProviderName: "testEcsProviderName",
    }

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', prop3);

    const prop = {
      autoScalingGroup: autoScalingGroup,
      enableManagedTerminationProtection: false,
      canContainersAccessInstanceRole: accessRole,
      capacityProviderName: "testEcsProviderName",
    }

    new ecs.AsgCapacityProvider(this, 'MyAsgCapacityProvider', prop);

    cluster.addAsgCapacityProvider(capacityProvider);

    capacityProvider.autoScalingGroup.addUserData('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    capacityProvider.autoScalingGroup.addUserData('echo test >> /tmp/test');

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef2', {
      //networkMode: ecs.NetworkMode.AWS_VPC,
    });

    const container = taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 1024,
      cpu: 256,
    });

    const service = new ecs.Ec2Service(this, 'EC2Service', {
      cluster,
      taskDefinition,
    });
  }
}
